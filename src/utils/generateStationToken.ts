import jwt from 'jsonwebtoken';
import StationEntity from '../entities/StationEntity';
import StationTokenResponse from '../types/StationTokenResponse';
import { env } from './environment';

export default function (station: StationEntity): StationTokenResponse {
    return {
        accessToken: jwt.sign({
            sub: station.id,
            roles: ['station'],
        }, env.ACCESS_TOKEN_SECRET),
    }
}
