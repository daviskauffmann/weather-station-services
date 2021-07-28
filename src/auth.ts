import { Request } from 'express';
import { Action } from 'routing-controllers';
import { AuthChecker } from 'type-graphql';
import { env } from './environment';

function checkAuth(apiKey?: string, roles?: string[]) {
    if (apiKey !== env.API_KEY) {
        return false;
    }

    return true;
}

export async function authorizationChecker(action: Action, roles: string[]) {
    return checkAuth((action.request as Request).headers['x-api-key'] as string, roles);
}

export const authChecker: AuthChecker<Request> = (data, roles) => {
    return checkAuth(data.context.headers['x-api-key'] as string, roles);
};
