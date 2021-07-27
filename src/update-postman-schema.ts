import debug from 'debug';
import https from 'https';
import { env, pkg } from './environment';

const log = debug(`${pkg.name}`);
const error = debug(`${pkg.name}:error`);

export default async function (schema: string) {
    if (env.POSTMAN_API_KEY &&
        env.POSTMAN_API_ID &&
        env.POSTMAN_API_VERSION_ID &&
        env.POSTMAN_SCHEMA_ID
    ) {
        const request = https.request({
            method: 'PUT',
            hostname: 'api.getpostman.com',
            path: `/apis/${process.env.POSTMAN_API_ID}/versions/${process.env.POSTMAN_API_VERSION_ID}/schemas/${process.env.POSTMAN_SCHEMA_ID}`,
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
                    log('postman schema updated');
                } else {
                    error('error updating postman schema', response.statusCode, body);
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
                schema,
            },
        }));

        request.end();
    }
}
