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
  TYPEORM_CONNECTION: str({
    devDefault: 'mongodb',
  }),
  TYPEORM_HOST: str({
    devDefault: 'localhost',
  }),
  TYPEORM_PORT: str({
    devDefault: '27017',
  }),
  TYPEORM_DATABASE: str({
    devDefault: 'weather',
  }),
  API_KEY: str({
    devDefault: '1234',
  }),
});
