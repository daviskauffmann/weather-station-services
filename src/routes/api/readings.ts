import router from 'koa-joi-router';
import passport from 'koa-passport';
import Reading from '../../models/Reading';
import { OBJECT_ID_REGEX } from '../../utils/constants';

const routes = router();
const Joi = router.Joi;

routes.route({
    method: 'GET',
    path: '/',
    pre: passport.authenticate('headerapikey', { session: false }),
    validate: {
        query: {
            start: Joi.string().isoDate(),
            end: Joi.string().isoDate(),
        }
    },
    handler: async ctx => {
        const readings = await Reading.find({
            date: {
                $gte: new Date(ctx.query.start || 0),
                $lte: new Date(ctx.query.end || Date.now()),
            },
        });
        ctx.status = 200;
        ctx.body = { items: readings };
    },
});

routes.route({
    method: 'POST',
    path: '/',
    pre: passport.authenticate('headerapikey', { session: false }),
    validate: {
        type: 'json',
        body: {
            temperature: Joi.number().required(),
            pressure: Joi.number().required(),
            humidity: Joi.number().required(),
            date: Joi.string().isoDate().required(),
        },
    },
    handler: async ctx => {
        const reading = await Reading.create(ctx.request.body);
        ctx.status = 201;
        ctx.body = reading;
    },
});

routes.route({
    method: 'GET',
    path: '/:id',
    pre: passport.authenticate('headerapikey', { session: false }),
    validate: {
        params: {
            id: Joi.string().regex(OBJECT_ID_REGEX),
        },
    },
    handler: async ctx => {
        const reading = await Reading.findById(ctx.params.id);
        if (!reading) {
            return ctx.throw(404, `Reading ${ctx.params.id} not found`);
        }
        ctx.status = 200;
        ctx.body = reading;
    },
});

routes.route({
    method: 'PUT',
    path: '/:id',
    pre: passport.authenticate('headerapikey', { session: false }),
    validate: {
        params: {
            id: Joi.string().regex(OBJECT_ID_REGEX),
        },
        body: {
            temperature: Joi.number(),
            pressure: Joi.number(),
            humidity: Joi.number(),
            date: Joi.string().isoDate(),
        },
        type: 'json',
    },
    handler: async ctx => {
        const reading = await Reading.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!reading) {
            return ctx.throw(404, `Reading ${ctx.params.id} not found`);
        }
        ctx.status = 200;
        ctx.body = reading;
    },
});

routes.route({
    method: 'DELETE',
    path: '/:id',
    pre: passport.authenticate('headerapikey', { session: false }),
    validate: {
        params: {
            id: Joi.string().regex(OBJECT_ID_REGEX),
        },
    },
    handler: async ctx => {
        const reading = await Reading.findByIdAndDelete(ctx.params.id);
        if (!reading) {
            return ctx.throw(404, `Reading ${ctx.params.id} not found`);
        }
        ctx.status = 200;
    },
});

export default routes;
