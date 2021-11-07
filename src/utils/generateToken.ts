import jwt from 'jsonwebtoken';
import UserEntity from '../entities/UserEntity';
import TokenResponse from '../types/TokenResponse';
import { env } from './environment';

export default function (user: UserEntity): TokenResponse {
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
