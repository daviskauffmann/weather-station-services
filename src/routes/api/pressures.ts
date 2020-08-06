import router from 'koa-joi-router';
import passport from 'koa-passport';
import Pressure from '../../models/Pressure';

const routes = router();
const Joi = router.Joi;

routes.route({
    method: 'GET',
    path: '/',
    pre: passport.authenticate('headerapikey', { session: false }),
    handler: async ctx => {
        const pressures = await Pressure.find();
        ctx.status = 200;
        ctx.body = { items: pressures };
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
        const pressure = await Pressure.create(ctx.request.body);
        ctx.status = 201;
        ctx.body = pressure;
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
        const pressure = await Pressure.findById(ctx.params.id);
        if (!pressure) {
            ctx.status = 404;
            ctx.body = `Pressure ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
        ctx.body = pressure;
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
        const pressure = await Pressure.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!pressure) {
            ctx.status = 404;
            ctx.body = `Pressure ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
        ctx.body = pressure;
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
        const pressure = await Pressure.findByIdAndDelete(ctx.params.id);
        if (!pressure) {
            ctx.status = 404;
            ctx.body = `Pressure ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
    },
});

export default routes;
