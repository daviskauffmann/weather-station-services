import cors from '@koa/cors';
import bcrypt from 'bcrypt';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import debug from 'debug';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import graphqlHTTP from 'koa-graphql';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import mount from 'koa-mount';
import { koaSwagger } from 'koa2-swagger-ui';
import { getMetadataArgsStorage, RoutingControllersOptions, useContainer as rcUseContainer, useKoaServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { createSocketServer, useContainer as scUseContainer } from 'socket-controllers';
import { buildSchema } from 'type-graphql';
import { Container, Token } from 'typedi';
import { createConnection, getManager, ObjectLiteral, useContainer as typeOrmUserCOntainer } from 'typeorm';
import MessageController from './controllers/MessageController';
import ReadingController from './controllers/ReadingController';
import StationController from './controllers/StationController';
import TokenController from './controllers/TokenController';
import UserController from './controllers/UserController';
import Reading from './entities/Reading';
import Station from './entities/Station';
import User from './entities/User';
import BaseRepository from './repositories/BaseRepository';
import ReadingRepository from './repositories/ReadingRepository';
import StationRepository from './repositories/StationRepository';
import UserRepository from './repositories/UserRepository';
import ReadingResolver from './resolvers/ReadingResolver';
import StationResolver from './resolvers/StationResolver';
import checkAuth from './utils/checkAuth';
import { env, pkg } from './utils/environment';
import updatePostman from './utils/updatePostman';

// TODO: apparently typedi update broke this
// https://github.com/typestack/class-validator/issues/928
// cvUseContainer(Container);
rcUseContainer(Container);
scUseContainer(Container);
typeOrmUserCOntainer(Container);

const log = debug(`${pkg.name}`);
const error = debug(`${pkg.name}:error`);

const connectionType = 'postgres';

createConnection({
    type: connectionType,
    host: env.POSTGRES_HOST,
    port: env.POSTGRES_PORT,
    username: env.POSTGRES_USERNAME,
    password: env.POSTGRES_PASSWORD,
    database: env.POSTGRES_DATABASE,
    entities: [
        Reading,
        Station,
        User,
    ],
    synchronize: true,
}).then(async () => {
    // init timescaledb
    await getManager().query(`CREATE EXTENSION IF NOT EXISTS timescaledb`);

    // init repositories
    await Promise.all(([
        ReadingRepository,
        StationRepository,
        UserRepository,
    ] as Token<BaseRepository<ObjectLiteral>>[]).map(Repository => Container.get(Repository).init()));

    // TODO: insert admin user if not exists
    await getManager().query(`
        INSERT INTO "user" ("id", "username", "password", "email", "roles")
        SELECT
            1 AS "id",
            'admin' AS "username",
            '${await bcrypt.hash('admin', 10)}' AS "password",
            'admin@admin.com' AS "email",
            ARRAY['admin'] AS "roles"
        WHERE NOT EXISTS (
            SELECT "id"
            FROM "user"
            WHERE "id" = 1
        )
    `);

    log(`connected to ${connectionType} database "${env.POSTGRES_DATABASE}" at ${env.POSTGRES_HOST}:${env.POSTGRES_PORT}`);

    // rest api
    const app = new Koa();

    // request logging
    app.use(logger());

    // security
    app.use(helmet({
        contentSecurityPolicy: false, // TODO: figure out correct CSP
    }));

    // cors
    app.use(cors());

    // body parser
    app.use(bodyParser({
        extendTypes: {
            json: [
                'application/graphql',
            ],
        },
    }));

    // default error handler
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = err.httpCode || 500;
            ctx.body = {
                name: err.name,
                message: err.message || undefined,
                stack: err.stack,
                errors: err.errors,
            };
        }
    });

    // routing controllers
    const routingControllersOptions: RoutingControllersOptions = {
        controllers: [
            ReadingController,
            StationController,
            TokenController,
            UserController,
        ],
        authorizationChecker: ({ context }, roles) => checkAuth(context, roles),
        defaultErrorHandler: false,
    };

    useKoaServer(app, routingControllersOptions);

    // websocket server
    // TODO: doesn't work
    createSocketServer(env.WS_PORT, {
        controllers: [
            MessageController,
        ],
    });

    // graphql
    const schema = await buildSchema({
        resolvers: [
            ReadingResolver,
            StationResolver,
        ],
        container: Container,
        authChecker: ({ context }, roles) => checkAuth(context, roles),
    });

    app.use(mount('/graphql', graphqlHTTP({
        schema,
        graphiql: env.NODE_ENV !== 'production',
    })));

    // swagger
    const spec = routingControllersToSpec(getMetadataArgsStorage(), routingControllersOptions, {
        components: {
            schemas: validationMetadatasToSchemas({
                classTransformerMetadataStorage: defaultMetadataStorage,
                refPointerPrefix: '#/components/schemas/',
            }),
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
        info: {
            description: 'Generated with `routing-controllers-openapi`',
            title: 'A sample API',
            version: '1.0.0',
        },
    });

    app.use(koaSwagger({
        swaggerOptions: {
            spec,
        },
    }));

    // start server
    app.listen(env.PORT, () => {
        log(`listening on port ${env.PORT}`);

        updatePostman(spec, schema);
    });
});
