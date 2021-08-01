import { Request } from 'express';
import jwt from 'jsonwebtoken';

export default function (request: Request, roles: string[]) {
    const authorization = request.headers['authorization'];
    if (!authorization) {
        return false;
    }

    const accessToken = authorization.replace('Bearer ', '');
    const decoded = jwt.verify(accessToken, '1234') as jwt.JwtPayload;

    for (const role of roles) {
        if (!(decoded.roles as string[]).includes(role)) {
            return false;
        }
    }

    (request as any).jwt = decoded;

    return true;
}
