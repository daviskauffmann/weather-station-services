import { IncomingHttpHeaders } from 'http';
import { env } from './environment';

export default function (headers: IncomingHttpHeaders, roles?: string[]) {
    if (headers['x-api-key'] === env.API_KEY) {
        return true;
    }

    return false;
}
