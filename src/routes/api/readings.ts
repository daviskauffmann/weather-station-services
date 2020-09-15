import router from 'koa-joi-router';
import passport from 'koa-passport';
import mongoose from 'mongoose';
import Reading, { WindDirection } from '../../models/Reading';
import Sensor from '../../models/Sensor';
import { OBJECT_ID_REGEX } from '../../utils/constants';

const routes = router();
const Joi = router.Joi;

routes.route({
    method: 'POST',
    path: '/',
    pre: passport.authenticate('headerapikey', { session: false }),
    validate: {
        type: 'json',
        body: {
            sensorId: Joi.string().regex(OBJECT_ID_REGEX).required(),
            timestamp: Joi.number().required(),
            temperature: Joi.number().required(),
            pressure: Joi.number().required(),
            humidity: Joi.number().required(),
            windSpeed: Joi.number().required(),
            windDirection: Joi.string().allow(Object.values(WindDirection)).required(),
            rainfall: Joi.number().required(),
        },
    },
    handler: async ctx => {
        const sensorId = mongoose.Types.ObjectId(ctx.request.body.sensorId);
        const sensor = await Sensor.findById(sensorId);
        if (!sensor) {
            return ctx.throw(404, `Sensor ${sensorId} not found`);
        }

        const day = new Date(ctx.request.body.timestamp);
        day.setMilliseconds(0);
        day.setSeconds(0);
        day.setMinutes(0);
        day.setHours(0);

        await Reading.updateOne({
            sensorId,
            day,
            count: {
                $lt: 200,
            },
        }, {
            $push: {
                data: {
                    timestamp: ctx.request.body.timestamp,
                    temperature: ctx.request.body.temperature,
                    pressure: ctx.request.body.pressure,
                    humidity: ctx.request.body.humidity,
                    windSpeed: ctx.request.body.windSpeed,
                    windDirection: ctx.request.body.windDirection,
                    rainfall: ctx.request.body.rainfall,
                },
            },
            $inc: {
                count: 1,
            },
        }, {
            upsert: true,
        });

        ctx.status = 200;
    },
});


export default routes;
