import jwt from 'jsonwebtoken';
import Station from '../entities/Station';
import User from '../entities/User';

export function generateUserTokens(user: User) {
    return {
        accessToken: jwt.sign({
            sub: user.id,
            roles: user.roles,
        }, '1234', { expiresIn: '1h' }),
        refreshToken: jwt.sign({
            sub: user.id,
        }, '4321', { expiresIn: '1d' }),
        expires: 3600,
    };
}

export function generateStationToken(station: Station) {
    return {
        accessToken: jwt.sign({
            sub: station.id,
            roles: ['station'],
        }, '1234'),
    }
}
