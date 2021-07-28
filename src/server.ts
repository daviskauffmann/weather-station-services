import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import debug from 'debug';
import express, { NextFunction, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { printSchema } from 'graphql';
import logger from 'morgan';
import { getMetadataArgsStorage, HttpError, RoutingControllersOptions, useContainer as rcUseContainer, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { createSocketServer, useContainer as scUseContainer } from 'socket-controllers';
import * as swaggerUiExpress from 'swagger-ui-express';
import { buildSchema } from 'type-graphql';
import { Container, Token } from 'typedi';
import { createConnection, getManager, ObjectLiteral, useContainer as typeOrmUserCOntainer } from 'typeorm';
import { authChecker, authorizationChecker } from './auth';
import { MessageController } from './controllers/message';
import { ReadingController } from './controllers/reading';
import { StationController } from './controllers/station';
import { Reading } from './entities/reading';
import { Station } from './entities/station';
import { env, pkg } from './environment';
import { BaseRepository } from './repositories/base-repository';
import { ReadingRepository } from './repositories/reading';
import { StationRepository } from './repositories/station';
import { StationResolver } from './resolvers/station';
import updatePostmanSchema from './update-postman-schema';

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

    // body parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (env.WS) {
        // websocket server
        createSocketServer(env.PORT, {
            controllers: [
                MessageController,
            ],
        });
    } else {
        // routing controllers
        const routingControllersOptions: RoutingControllersOptions = {
            controllers: [
                ReadingController,
                StationController,
            ],
            authorizationChecker,
            defaultErrorHandler: false,
        };

        useExpressServer(app, routingControllersOptions);

        // graphql
        const schema = await buildSchema({
            resolvers: [
                StationResolver,
            ],
            container: Container,
            authChecker,
        });

        app.use('/graphql', graphqlHTTP({
            schema,
            graphiql: env.NODE_ENV !== 'production',
        }));

        updatePostmanSchema(printSchema(schema));

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
            info: {
                description: 'Generated with `routing-controllers-openapi`',
                title: 'A sample API',
                version: '1.0.0',
            },
        });

        app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

        app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
            res.status(err.httpCode || 500).send(err);
        });

        app.listen(env.PORT, () => {
            log(`listening on port ${env.PORT}`);
        });
    }
});
