import passport from 'koa-passport';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';

passport.use(new HeaderAPIKeyStrategy({
    header: 'Authorization',
    prefix: 'Api-Key ',
}, false, async (apiKey, verified) => {
    if (apiKey !== process.env.API_KEY) return verified(null, false);
    verified(null, true);
}));

export default passport;
