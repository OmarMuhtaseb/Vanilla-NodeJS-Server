import {IncomingMessage, ServerResponse} from 'http';
import {HttpStatusCode, UnAuthenticatedException} from '../exception';
import {ExceptionResponse} from '../types';
import {CALU_KEY_HEADER, CALU_KEY_VALUE} from './constants';

export async function loggingMiddleware(req: IncomingMessage, res: ServerResponse, next: Function) {
    try {
        await next();
        console.log(`[${new Date().toISOString()}] INFO --- ${req.url} ${res.statusCode}`);
    } catch (e) {
        console.error(`[${new Date().toISOString()}] ERROR -- ${req.url} ${res.statusCode}`);
    }
}

export async function authenticationMiddleware(req: IncomingMessage, res: ServerResponse, next: Function) {
    const caluHeader = req.headers[CALU_KEY_HEADER];

    if (!caluHeader) {
        throw new UnAuthenticatedException();
    }

    if (caluHeader !== CALU_KEY_VALUE) {
        throw new UnAuthenticatedException();
    }

    await next();
}

export async function errorMiddleware(req: IncomingMessage, res: ServerResponse, next: Function) {
    try {
        await next();
    } catch (e) {
        console.log(e);
        const httpCode = e.httpCode || HttpStatusCode.INTERNAL_SERVER;
        const response: ExceptionResponse = {
            error: {
                code: httpCode,
                message: e.message || 'INTERNAL_SERVER_ERROR',
                path: req.url,
            }
        };
        res.setHeader('content-type', 'application/json');
        res.writeHead(httpCode);
        res.write(JSON.stringify(response));
        res.end();
    }
}
