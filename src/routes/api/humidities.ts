import router from 'koa-joi-router';
import passport from 'koa-passport';
import Humidity from '../../models/Humidity';

const routes = router();
const Joi = router.Joi;

routes.route({
    method: 'GET',
    path: '/',
    pre: passport.authenticate('headerapikey', { session: false }),
    handler: async ctx => {
        const humidities = await Humidity.find();
        ctx.status = 200;
        ctx.body = { items: humidities };
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
        const humidity = await Humidity.create(ctx.request.body);
        ctx.status = 201;
        ctx.body = humidity;
    },
});

routes.route({
    method: 'GET',
    path: '/:id',
    pre: passport.authenticate('headerapikey', { session: false }),
    handler: async ctx => {
        const humidity = await Humidity.findById(ctx.params.id);
        if (!humidity) {
            ctx.status = 404;
            ctx.body = `Humidity ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
        ctx.body = humidity;
    },
});

routes.route({
    method: 'PUT',
    path: '/:id',
    pre: passport.authenticate('headerapikey', { session: false }),
    validate: {
        type: 'json',
        body: {
            value: Joi.number(),
            date: Joi.string().isoDate(),
        },
    },
    handler: async ctx => {
        const humidity = await Humidity.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!humidity) {
            ctx.status = 404;
            ctx.body = `Humidity ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
        ctx.body = humidity;
    },
});

routes.route({
    method: 'DELETE',
    path: '/:id',
    pre: passport.authenticate('headerapikey', { session: false }),
    handler: async ctx => {
        const humidity = await Humidity.findByIdAndDelete(ctx.params.id);
        if (!humidity) {
            ctx.status = 404;
            ctx.body = `Humidity ${ctx.params.id} not found`;
            return;
        }
        ctx.status = 200;
    },
});

export default routes;
