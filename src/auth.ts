import { Request } from 'express';
import { Action } from 'routing-controllers';
import { AuthChecker } from 'type-graphql';
import { env } from './environment';

function checkAuth(token?: string, roles?: string[]) {
    if (token !== env.API_KEY) {
        return false;
    }

    return true;
}

export async function authorizationChecker(action: Action, roles: string[]) {
    return checkAuth((action.request as Request).headers.authorization, roles);
}

export const authChecker: AuthChecker<Request> = (data, roles) => {
    return checkAuth(data.context.headers.authorization, roles);
};
