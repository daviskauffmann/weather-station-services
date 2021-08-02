import bcrypt from 'bcrypt';
import { defaultMetadataStorage } from 'class-transformer/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import cors from 'cors';
import debug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { printSchema } from 'graphql';
import helmet from 'helmet';
import { js as beautify } from 'js-beautify';
import logger from 'morgan';
import { getMetadataArgsStorage, HttpError, RoutingControllersOptions, useContainer as rcUseContainer, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { createSocketServer, useContainer as scUseContainer } from 'socket-controllers';
import * as swaggerUiExpress from 'swagger-ui-express';
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
    `)

    log(`connected to ${connectionType} database "${env.POSTGRES_DATABASE}" at ${env.POSTGRES_HOST}:${env.POSTGRES_PORT}`);

    // rest api
    const app = express();

    // request logging
    app.use(logger(env.LOG_FORMAT));

    // security
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: [`'self'`, `'unsafe-inline'`],
                imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
                scriptSrc: [`'self'`, `'unsafe-inline'`, `'unsafe-eval'`],
            },
        },
    }));

    // cors
    app.use(cors());

    // body parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // routing controllers
    const routingControllersOptions: RoutingControllersOptions = {
        controllers: [
            ReadingController,
            StationController,
            TokenController,
            UserController,
        ],
        authorizationChecker: (action, roles) => checkAuth(action.request, roles),
        defaultErrorHandler: false,
    };

    useExpressServer(app, routingControllersOptions);

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
        authChecker: (data, roles) => checkAuth(data.context, roles),
    });

    app.use('/graphql', graphqlHTTP({
        schema,
        graphiql: env.NODE_ENV !== 'production',
    }));

    // swagger
    const schemas = validationMetadatasToSchemas({
        classTransformerMetadataStorage: defaultMetadataStorage,
        refPointerPrefix: '#/components/schemas/',
    });
    const storage = getMetadataArgsStorage()
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
        components: {
            schemas,
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

    app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

    // error handler
    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
        res.status(err.httpCode || 500).send({
            name: err.name,
            message: err.message,
            stack: err.stack,
            errors: (err as any).errors,
        });
    });

    // start server
    app.listen(env.PORT, () => {
        log(`listening on port ${env.PORT}`);

        updatePostman(beautify(JSON.stringify(spec)), printSchema(schema));
    });
});
