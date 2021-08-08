import debug from 'debug';
import { GraphQLSchema, printSchema } from 'graphql';
import https from 'https';
import { js as beautify } from 'js-beautify';
import { OpenAPIObject } from 'openapi3-ts';
import { env, pkg } from './environment';

const log = debug(`${pkg.name}`);
const error = debug(`${pkg.name}:error`);

export default async function (spec: OpenAPIObject, schema: GraphQLSchema) {
    if (env.POSTMAN_API_KEY) {
        if (env.POSTMAN_REST_API_ID && env.POSTMAN_REST_VERSION_ID && env.POSTMAN_REST_SCHEMA_ID) {
            const request = https.request({
                method: 'PUT',
                hostname: 'api.getpostman.com',
                path: `/apis/${process.env.POSTMAN_REST_API_ID}/versions/${process.env.POSTMAN_REST_VERSION_ID}/schemas/${process.env.POSTMAN_REST_SCHEMA_ID}`,
                headers: {
                    'X-Api-Key': process.env.POSTMAN_API_KEY,
                    'Content-Type': 'application/json',
                },
            }, response => {
                const chunks: Buffer[] = [];
                response.on('data', chunk => {
                    chunks.push(chunk);
                });

                response.on('end', () => {
                    const body = JSON.parse(Buffer.concat(chunks).toString());
                    if (response.statusCode === 200) {
                        log('postman openapi schema updated');
                    } else {
                        error('error updating postman openapi schema', response.statusCode, body);
                    }
                });

                response.on('error', err => {
                    error(err);
                });
            });

            request.write(JSON.stringify({
                schema: {
                    type: 'openapi3',
                    language: 'json',
                    schema: beautify(JSON.stringify(spec)),
                },
            }));

            request.end();
        }

        if (env.POSTMAN_GRAPHQL_API_ID && env.POSTMAN_GRAPHQL_VERSION_ID && env.POSTMAN_GRAPHQL_SCHEMA_ID) {
            const request = https.request({
                method: 'PUT',
                hostname: 'api.getpostman.com',
                path: `/apis/${process.env.POSTMAN_GRAPHQL_API_ID}/versions/${process.env.POSTMAN_GRAPHQL_VERSION_ID}/schemas/${process.env.POSTMAN_GRAPHQL_SCHEMA_ID}`,
                headers: {
                    'X-Api-Key': process.env.POSTMAN_API_KEY,
                    'Content-Type': 'application/json',
                },
            }, response => {
                const chunks: Buffer[] = [];
                response.on('data', chunk => {
                    chunks.push(chunk);
                });

                response.on('end', () => {
                    const body = JSON.parse(Buffer.concat(chunks).toString());
                    if (response.statusCode === 200) {
                        log('postman graphql schema updated');
                    } else {
                        error('error updating postman graphql schema', response.statusCode, body);
                    }
                });

                response.on('error', err => {
                    error(err);
                });
            });

            request.write(JSON.stringify({
                schema: {
                    type: 'graphql',
                    language: 'graphql',
                    schema: printSchema(schema),
                },
            }));

            request.end();
        }
    }
}
