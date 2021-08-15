import jwt from 'jsonwebtoken';
import StationEntity from '../entities/StationEntity';
import UserEntity from '../entities/UserEntity';
import { env } from './environment';

export function generateUserTokens(user: UserEntity) {
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

export function generateStationToken(station: StationEntity) {
    return {
        accessToken: jwt.sign({
            sub: station.id,
            roles: ['station'],
        }, env.ACCESS_TOKEN_SECRET),
    }
}
