import debug from 'debug';
import 'reflect-metadata';
import { env, pkg } from './utils/environment';

const log = debug(`${pkg.name}`);

log(`application in ${env.NODE_ENV} mode`);

export * from './server';
