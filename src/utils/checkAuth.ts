import jwt from 'jsonwebtoken';
import Koa from 'koa';
import { ForbiddenError, UnauthorizedError } from 'routing-controllers';
import { env } from './environment';

export default function (request: Koa.Context, roles: string[]) {
    const authorization = request.headers['authorization'];
    if (!authorization) {
        throw new UnauthorizedError();
    }

    const accessToken = authorization.replace('Bearer ', '');
    let decoded: jwt.JwtPayload;
    try {
        decoded = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    } catch (err) {
        throw new UnauthorizedError(err.message);
    }

    for (const role of roles) {
        if (!(decoded.roles as string[]).includes(role)) {
            throw new ForbiddenError();
        }
    }

    request.state.user = {
        id: decoded.sub,
        roles: decoded.roles,
    };

    return true;
}
