import { envsafe, num, port, str } from 'envsafe';

export const pkg = require('../../package.json');

export const env = envsafe({
    NODE_ENV: str({
        devDefault: 'development',
        choices: ['development', 'test', 'production'],
    }),
    DEBUG: str({
        default: `${pkg.name}*`,
    }),
    PORT: port({
        default: 3000,
    }),
    WS_PORT: port({
        default: 3001,
    }),
    POSTGRES_HOST: str({
        devDefault: 'localhost',
    }),
    POSTGRES_PORT: num({
        devDefault: 5432,
    }),
    POSTGRES_DATABASE: str({
        devDefault: 'weather',
    }),
    POSTGRES_USERNAME: str({
        devDefault: 'postgres',
    }),
    POSTGRES_PASSWORD: str({
        devDefault: 'postgres',
    }),
    ACCESS_TOKEN_SECRET: str({
        devDefault: 'access-token-secret',
    }),
    REFRESH_TOKEN_SECRET: str({
        devDefault: 'refresh-token-secret',
    }),
    POSTMAN_API_KEY: str({
        default: '',
        allowEmpty: true,
    }),
    POSTMAN_REST_API_ID: str({
        default: '',
        allowEmpty: true,
    }),
    POSTMAN_REST_VERSION_ID: str({
        default: '',
        allowEmpty: true,
    }),
    POSTMAN_REST_SCHEMA_ID: str({
        default: '',
        allowEmpty: true,
    }),
    POSTMAN_GRAPHQL_API_ID: str({
        default: '',
        allowEmpty: true,
    }),
    POSTMAN_GRAPHQL_VERSION_ID: str({
        default: '',
        allowEmpty: true,
    }),
    POSTMAN_GRAPHQL_SCHEMA_ID: str({
        default: '',
        allowEmpty: true,
    }),
});
