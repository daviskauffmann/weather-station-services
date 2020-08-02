import express from 'express';
import { body } from 'express-validator';
import passport from 'passport';
import validate from './middleware/validate';
import expressAsync from './utils/expressAsync';
import Temperature from './models/Temperature';

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

router.route('/api/brew')
    .post(
        expressAsync(async (req, res) => {
            res.status(418).send('short and stout');
        }))
    .all((req, res) => res.sendStatus(405));

export default router;
