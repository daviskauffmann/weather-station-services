import { envsafe, port, str } from 'envsafe';

export const pkg = require('../package.json');

export const env = envsafe({
  NODE_ENV: str({
    devDefault: 'development',
    choices: ['development', 'test', 'production'],
  }),
  DEBUG: str({
    devDefault: '*',
  }),
  PORT: port({
    devDefault: 3000,
    desc: 'The port the app is running on',
    example: 80,
  }),
  POSTGRES_HOST: str({
    devDefault: 'localhost',
  }),
  POSTGRES_PORT: str({
    devDefault: '53524',
  }),
  POSTGRES_DATABASE: str({
    devDefault: 'weather',
  }),
  POSTGRES_USERNAME: str(),
  POSTGRES_PASSWORD: str(),
  API_KEY: str({
    devDefault: '1234',
  }),
});
