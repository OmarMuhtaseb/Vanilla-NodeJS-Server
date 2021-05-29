import {IncomingMessage, ServerResponse} from 'http';
import {authenticationMiddleware} from './middleware';
import {healthCheck} from './server';
import {Route} from './types';

export function router(controller: any): { [key: string]: Route } {
    return {
        'GET/list': {
            controller: (req: IncomingMessage, res: ServerResponse) => controller.list(req, res),
        },
        'GET/': {
            controller: (req: IncomingMessage, res: ServerResponse) => controller.markAsDelivered(req, res),
            middlewares: [authenticationMiddleware],
        },
        'GET/health-check': {
            controller: (req: IncomingMessage, res: ServerResponse) => healthCheck(req, res),
        }
    };
}
