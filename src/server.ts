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
import Reading from './entities/Reading';
import Station from './entities/Station';
import BaseRepository from './repositories/BaseRepository';
import ReadingRepository from './repositories/ReadingRepository';
import StationRepository from './repositories/StationRepository';
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
    ],
    synchronize: true,
}).then(async () => {
    // init timescaledb
    await getManager().query(`CREATE EXTENSION IF NOT EXISTS timescaledb`);

    // init repositories
    await Promise.all(([
        ReadingRepository,
        StationRepository,
    ] as Token<BaseRepository<ObjectLiteral>>[]).map(Repository => Container.get(Repository).init()));

    log(`connected to ${connectionType} database "${env.POSTGRES_DATABASE}" at ${env.POSTGRES_HOST}:${env.POSTGRES_PORT}`);

    // rest api
    const app = express();

    // request logging
    app.use(logger(env.LOG_FORMAT));

    // security
    app.use(helmet());

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
        ],
        authorizationChecker: (action, roles) => checkAuth(action.request.headers, roles),
        defaultErrorHandler: false,
    };

    useExpressServer(app, routingControllersOptions);

    // websocket server
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
        authChecker: (data, roles) => checkAuth(data.context.headers, roles),
    });

    app.use('/graphql', graphqlHTTP({
        schema,
        graphiql: env.NODE_ENV !== 'production',
    }));

    // swagger
    const schemas = validationMetadatasToSchemas({
        classTransformerMetadataStorage: require('class-transformer/cjs/storage').defaultMetadataStorage,
        refPointerPrefix: '#/components/schemas/',
    });
    const storage = getMetadataArgsStorage()
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
        components: {
            schemas,
            securitySchemes: {
                apiKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
        security: [
            {
                apiKey: [],
            },
        ],
        info: {
            description: 'Generated with `routing-controllers-openapi`',
            title: 'A sample API',
            version: '1.0.0',
        },
    });

    app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

    app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
        res.status(err.httpCode || 500).send({
            name: err.name,
            message: err.message,
            stack: err.stack,
            errors: (err as any).errors,
        });
    });

    app.listen(env.PORT, () => {
        log(`listening on port ${env.PORT}`);

        updatePostman(beautify(JSON.stringify(spec)), printSchema(schema));
    });
});
