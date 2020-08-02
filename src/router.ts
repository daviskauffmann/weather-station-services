import express from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import validate from './middleware/validate';
import Humidity from './models/Humidity';
import Pressure from './models/Pressure';
import Temperature from './models/Temperature';
import expressAsync from './utils/expressAsync';

const router = express.Router();

router.route('/api/temperatures')
    .get(
        passport.authenticate('headerapikey', { session: false }),
        expressAsync(async (req, res) => {
            const temperatures = await Temperature.find();
            res.status(200).send({ items: temperatures });
        }))
    .post(
        passport.authenticate('headerapikey', { session: false }),
        validate([
            body('value').isNumeric(),
            body('date').isISO8601(),
        ]),
        expressAsync(async (req, res) => {
            const temperature = await Temperature.create(req.body);
            res.status(201).send(temperature);
        }))
    .all((req, res) => res.sendStatus(405));

router.route('/api/temperatures/:id')
    .get(
        passport.authenticate('headerapikey', { session: false }),
        expressAsync(async (req, res) => {
            const temperature = await Temperature.findById(req.params.id);
            if (!temperature) res.status(404).send(`Temperature ${req.params.id} not found`);
            res.status(200).send(temperature);
        }))
    .put(
        passport.authenticate('headerapikey', { session: false }),
        validate([
            body('value').isNumeric().optional(),
            body('date').isISO8601().optional(),
        ]),
        expressAsync(async (req, res) => {
            const temperature = await Temperature.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!temperature) res.status(404).send(`Temperature ${req.params.id} not found`);
            res.status(200).send(temperature);
        }))
    .delete(
        passport.authenticate('headerapikey', { session: false }),
        expressAsync(async (req, res) => {
            const temperature = await Temperature.findByIdAndDelete(req.params.id);
            if (!temperature) res.status(404).send(`Temperature ${req.params.id} not found`);
            res.sendStatus(200);
        }))
    .all((req, res) => res.sendStatus(405));

router.route('/api/pressures')
    .get(
        passport.authenticate('headerapikey', { session: false }),
        expressAsync(async (req, res) => {
            const pressures = await Pressure.find();
            res.status(200).send({ items: pressures });
        }))
    .post(
        passport.authenticate('headerapikey', { session: false }),
        validate([
            body('value').isNumeric(),
            body('date').isISO8601(),
        ]),
        expressAsync(async (req, res) => {
            const pressure = await Pressure.create(req.body);
            res.status(201).send(pressure);
        }))
    .all((req, res) => res.sendStatus(405));

router.route('/api/pressures/:id')
    .get(
        passport.authenticate('headerapikey', { session: false }),
        expressAsync(async (req, res) => {
            const pressure = await Pressure.findById(req.params.id);
            if (!pressure) res.status(404).send(`Pressure ${req.params.id} not found`);
            res.status(200).send(pressure);
        }))
    .put(
        passport.authenticate('headerapikey', { session: false }),
        validate([
            body('value').isNumeric().optional(),
            body('date').isISO8601().optional(),
        ]),
        expressAsync(async (req, res) => {
            const pressure = await Pressure.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!pressure) res.status(404).send(`Pressure ${req.params.id} not found`);
            res.status(200).send(pressure);
        }))
    .delete(
        passport.authenticate('headerapikey', { session: false }),
        expressAsync(async (req, res) => {
            const pressure = await Pressure.findByIdAndDelete(req.params.id);
            if (!pressure) res.status(404).send(`Pressure ${req.params.id} not found`);
            res.sendStatus(200);
        }))
    .all((req, res) => res.sendStatus(405));

router.route('/api/humidities')
    .get(
        passport.authenticate('headerapikey', { session: false }),
        expressAsync(async (req, res) => {
            const humidities = await Humidity.find();
            res.status(200).send({ items: humidities });
        }))
    .post(
        passport.authenticate('headerapikey', { session: false }),
        validate([
            body('value').isNumeric(),
            body('date').isISO8601(),
        ]),
        expressAsync(async (req, res) => {
            const humidity = await Humidity.create(req.body);
            res.status(201).send(humidity);
        }))
    .all((req, res) => res.sendStatus(405));

router.route('/api/humidities/:id')
    .get(
        passport.authenticate('headerapikey', { session: false }),
        expressAsync(async (req, res) => {
            const humidity = await Humidity.findById(req.params.id);
            if (!humidity) res.status(404).send(`Humidity ${req.params.id} not found`);
            res.status(200).send(humidity);
        }))
    .put(
        passport.authenticate('headerapikey', { session: false }),
        validate([
            body('value').isNumeric().optional(),
            body('date').isISO8601().optional(),
        ]),
        expressAsync(async (req, res) => {
            const humidity = await Humidity.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!humidity) res.status(404).send(`Humidity ${req.params.id} not found`);
            res.status(200).send(humidity);
        }))
    .delete(
        passport.authenticate('headerapikey', { session: false }),
        expressAsync(async (req, res) => {
            const humidity = await Humidity.findByIdAndDelete(req.params.id);
            if (!humidity) res.status(404).send(`Humidity ${req.params.id} not found`);
            res.sendStatus(200);
        }))
    .all((req, res) => res.sendStatus(405));

router.route('/api/brew')
    .post(
        expressAsync(async (req, res) => {
            res.status(418).send('short and stout');
        }))
    .all((req, res) => res.sendStatus(405));

export default router;
