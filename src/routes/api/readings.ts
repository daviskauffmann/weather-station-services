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
            start: Joi.string().isoDate().default(0),
            end: Joi.string().isoDate().default(Date.now()),
            projection: Joi.string(),
            limit: Joi.number().default(10),
            skip: Joi.number().default(0),
            count: Joi.boolean().default(false),
        }
    },
    handler: async ctx => {
        const query = Reading.find({
            date: {
                $gte: new Date(ctx.query.start),
                $lte: new Date(ctx.query.end),
            },
        }, ctx.query.projection)
            .limit(ctx.query.limit)
            .skip(ctx.query.skip);
        const items = await query.exec();
        const count = ctx.query.count
            ? await query.countDocuments().exec()
            : undefined;
        ctx.status = 200;
        ctx.body = {
            items,
            count,
        };
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
