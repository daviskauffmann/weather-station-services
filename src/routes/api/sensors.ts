import router from 'koa-joi-router';
import passport from 'koa-passport';
import Sensor from '../../models/Sensor';
import { OBJECT_ID_REGEX } from '../../utils/constants';

const routes = router();
const Joi = router.Joi;

routes.route({
    method: 'GET',
    path: '/',
    pre: passport.authenticate('headerapikey', { session: false }),
    validate: {
        query: {
            createdFrom: Joi.string().isoDate().default(0),
            createdTo: Joi.string().isoDate().default(Date.now()),
            projection: Joi.string(),
            limit: Joi.number().default(10),
            skip: Joi.number().default(0),
            count: Joi.boolean().default(false),
        }
    },
    handler: async ctx => {
        const query = Sensor.find({
            createdOn: {
                $gte: new Date(ctx.query.createdFrom),
                $lte: new Date(ctx.query.createdTo),
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
            name: Joi.string().required(),
        },
    },
    handler: async ctx => {
        const sensor = await Sensor.create({
            name: ctx.request.body.name,
            createdOn: new Date(),
        });
        ctx.status = 201;
        ctx.body = sensor;
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
        const sensor = await Sensor.findById(ctx.params.id);
        if (!sensor) {
            return ctx.throw(404, `Sensor ${ctx.params.id} not found`);
        }
        ctx.status = 200;
        ctx.body = sensor;
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
            name: Joi.string().required(),
        },
        type: 'json',
    },
    handler: async ctx => {
        const sensor = await Sensor.findByIdAndUpdate(ctx.params.id, {
            name: ctx.request.body.name,
        }, {
            new: true,
        });
        if (!sensor) {
            return ctx.throw(404, `Sensor ${ctx.params.id} not found`);
        }
        ctx.status = 200;
        ctx.body = sensor;
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
        const sensor = await Sensor.findByIdAndDelete(ctx.params.id);
        if (!sensor) {
            return ctx.throw(404, `Sensor ${ctx.params.id} not found`);
        }
        ctx.status = 200;
    },
});

export default routes;
