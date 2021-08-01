import jwt from 'jsonwebtoken';
import Station from '../entities/Station';
import User from '../entities/User';
import { env } from './environment';

export function generateUserTokens(user: User) {
    return {
        accessToken: jwt.sign({
            sub: user.id,
            roles: user.roles,
        }, env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }),
        refreshToken: jwt.sign({
            sub: user.id,
        }, env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' }),
        expires: 3600,
    };
}

export function generateStationToken(station: Station) {
    return {
        accessToken: jwt.sign({
            sub: station.id,
            roles: ['station'],
        }, env.ACCESS_TOKEN_SECRET),
    }
}
