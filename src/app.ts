import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import passport from './passport';
import router from './router';

const app = new Koa();

app.use(logger());

app.use(helmet());
app.use(cors());

app.use(bodyParser());

app.use(passport.initialize());

if (process.env.NODE_ENV === 'production') {
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = {
                name: err.name,
                message: err.message,
            };
        }
    });
} else {
    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = {
                name: err.name,
                message: err.message,
                stack: err.stack,
            };
        }
    });
}

app.use(router.middleware());

export default app;
