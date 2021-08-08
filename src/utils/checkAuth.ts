import jwt from 'jsonwebtoken';
import Koa from 'koa';
import { env } from './environment';

export default function (request: Koa.Context, roles: string[]) {
    const authorization = request.headers['authorization'];
    if (!authorization) {
        return false;
    }

    const accessToken = authorization.replace('Bearer ', '');
    const decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;

    for (const role of roles) {
        if (!(decoded.roles as string[]).includes(role)) {
            return false;
        }
    }

    request.state.user = {
        id: decoded.sub,
        roles: decoded.roles,
    };

    return true;
}
