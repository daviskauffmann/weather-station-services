import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from './passport';
import router from './router';

const app = express();

app.use(morgan('dev'));

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(router);

if (process.env.NODE_ENV === 'production') {
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err);
        if (res.headersSent) {
            next(err);
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message,
            });
        }
    });
} else {
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.error(err);
        if (res.headersSent) {
            next(err);
        } else {
            res.status(500).send({
                name: err.name,
                message: err.message,
                stack: err.stack,
            });
        }
    });
}

export default app;
