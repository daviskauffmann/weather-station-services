import router from 'koa-joi-router';
import readings from './routes/api/readings';
import brew from './routes/brew';

const routes = router();

routes.use('/api/readings', readings.middleware());
routes.use('/brew', brew.middleware());

export default routes;
