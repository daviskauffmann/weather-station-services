import router from 'koa-joi-router';
import passport from 'koa-passport';
import Reading from '../../models/Reading';

const routes = router();
const Joi = router.Joi;

routes.route({
    method: 'GET',
    path: '/',
    pre: passport.authenticate('headerapikey', { session: false }),
    handler: async ctx => {
        const readings = await Reading.find();
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
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        },
    },
    handler: async ctx => {
        const reading = await Reading.findById(ctx.params.id);
        if (!reading) {
            ctx.status = 404;
            ctx.body = `Reading ${ctx.params.id} not found`;
            return;
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
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
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
            ctx.status = 404;
            ctx.body = `Reading ${ctx.params.id} not found`;
            return;
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
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
        },
    },
    handler: async ctx => {
        const reading = await Reading.findByIdAndDelete(ctx.params.id);
        if (!reading) {
            ctx.status = 404;
            ctx.body = `Reading ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
    },
});

export default routes;
