import cors from '@koa/cors';
import bcrypt from 'bcrypt';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import debug from 'debug';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import { koaSwagger } from 'koa2-swagger-ui';
import { getMetadataArgsStorage, RoutingControllersOptions, useContainer as rcUseContainer, useKoaServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { createSocketServer, useContainer as scUseContainer } from 'socket-controllers';
import { Container, Token } from 'typedi';
import { createConnection, getManager, ObjectLiteral, useContainer as typeOrmUseContainer } from 'typeorm';
import AuthController from './controllers/AuthController';
import MessageController from './controllers/MessageController';
import ReadingController from './controllers/ReadingController';
import StationController from './controllers/StationController';
import ReadingEntity from './entities/ReadingEntity';
import StationEntity from './entities/StationEntity';
import UserEntity from './entities/UserEntity';
import BaseRepository from './repositories/BaseRepository';
import ReadingRepository from './repositories/ReadingRepository';
import StationRepository from './repositories/StationRepository';
import UserRepository from './repositories/UserRepository';
import checkAuth from './utils/checkAuth';
import { env, pkg } from './utils/environment';
import updatePostman from './utils/updatePostman';

// TODO: apparently typedi update broke this
// https://github.com/typestack/class-validator/issues/928
// cvUseContainer(Container);
rcUseContainer(Container);
scUseContainer(Container);
typeOrmUseContainer(Container);

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
        ReadingEntity,
        StationEntity,
        UserEntity,
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
    // TODO: move to seed script
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

    // routing controllers
    const routingControllersOptions: RoutingControllersOptions = {
        controllers: [
            AuthController,
            ReadingController,
            StationController,
        ],
        authorizationChecker: ({ context }, roles) => checkAuth(context, roles),
        validation: {
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true,
        },
    };

    useKoaServer(app, routingControllersOptions);

    // websocket server
    // TODO: doesn't work
    createSocketServer(env.WS_PORT, {
        controllers: [
            MessageController,
        ],
    });

    // swagger
    const spec = routingControllersToSpec(getMetadataArgsStorage(), routingControllersOptions, {
        components: {
            schemas: validationMetadatasToSchemas({
                classTransformerMetadataStorage: require('class-transformer/cjs/storage').defaultMetadataStorage,
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
            title: pkg.name,
            version: pkg.version,
            description: pkg.description,
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

        updatePostman(spec);
    });
});
