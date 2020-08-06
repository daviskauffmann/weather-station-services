import router from 'koa-joi-router';
import passport from 'koa-passport';
import Temperature from '../../models/Temperature';

const routes = router();
const Joi = router.Joi;

routes.route({
    method: 'GET',
    path: '/',
    pre: passport.authenticate('headerapikey', { session: false }),
    handler: async ctx => {
        const temperatures = await Temperature.find();
        ctx.status = 200;
        ctx.body = { items: temperatures };
    },
});

routes.route({
    method: 'POST',
    path: '/',
    pre: passport.authenticate('headerapikey', { session: false }),
    validate: {
        type: 'json',
        body: {
            value: Joi.number().required(),
            date: Joi.string().isoDate().required(),
        },
    },
    handler: async ctx => {
        const temperature = await Temperature.create(ctx.request.body);
        ctx.status = 201;
        ctx.body = temperature;
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
        const temperature = await Temperature.findById(ctx.params.id);
        if (!temperature) {
            ctx.status = 404;
            ctx.body = `Temperature ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
        ctx.body = temperature;
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
            value: Joi.number(),
            date: Joi.string().isoDate(),
        },
        type: 'json',
    },
    handler: async ctx => {
        const temperature = await Temperature.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!temperature) {
            ctx.status = 404;
            ctx.body = `Temperature ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
        ctx.body = temperature;
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
        const temperature = await Temperature.findByIdAndDelete(ctx.params.id);
        if (!temperature) {
            ctx.status = 404;
            ctx.body = `Temperature ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
    },
});

export default routes;
