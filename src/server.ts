import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import debug from 'debug';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { printSchema } from 'graphql';
import logger from 'morgan';
import { getMetadataArgsStorage, RoutingControllersOptions, useContainer as rcUseContainer, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { createSocketServer } from 'socket-controllers';
import * as swaggerUiExpress from 'swagger-ui-express';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { createConnection, useContainer as typeOrmUserCOntainer } from 'typeorm';
import { authChecker, authorizationChecker } from './auth';
import { MessageController } from './controllers/message';
import { StationController } from './controllers/station';
import { Station } from './entities/station';
import { env, pkg } from './environment';
import { StationResolver } from './resolvers/station';
import updatePostmanSchema from './update-postman-schema';

rcUseContainer(Container);
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
    entities: [Station],
    synchronize: true,
}).then(async () => {
    log(`connected to ${connectionType} database "${env.POSTGRES_DATABASE}" at ${env.POSTGRES_HOST}:${env.POSTGRES_PORT}`);

    const app = express();

    // request logging
    app.use(logger(env.LOG_FORMAT));

    // body parser
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // routing controllers
    const routingControllersOptions: RoutingControllersOptions = {
        controllers: [
            StationController,
        ],
        authorizationChecker,
    };

    useExpressServer(app, routingControllersOptions);

    // websockets
    createSocketServer(3001, {
        controllers: [MessageController],
    });

    // graphql
    const schema = await buildSchema({
        resolvers: [StationResolver],
        container: Container,
        authChecker,
    });

    updatePostmanSchema(printSchema(schema));

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
                basicAuth: {
                    scheme: 'basic',
                    type: 'http',
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

    app.listen(env.PORT, () => {
        log(`listening on port ${env.PORT}`)
    });
});
