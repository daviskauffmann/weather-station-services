import router from 'koa-joi-router';
import humidities from './routes/api/humidities';
import pressures from './routes/api/pressures';
import temperatures from './routes/api/temperatures';
import brew from './routes/brew';

const routes = router();

routes.use('/api/humidities', humidities.middleware());
routes.use('/api/pressures', pressures.middleware());
routes.use('/api/temperatures', temperatures.middleware());
routes.use('/brew', brew.middleware());

export default routes;
