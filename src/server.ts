import * as http from 'http';
import {IncomingMessage, ServerResponse} from 'http';
import {URL} from 'url';
import {NotFoundException} from './exception';
import {errorMiddleware, loggingMiddleware, MiddlewareManager} from './middleware';
import {OrdersController} from './orders';
import {router} from './routes';
import {Route} from './types';

export {StatsService} from './stats';

export const notFound = {
    controller: (req: IncomingMessage, res: ServerResponse) => {
        throw new NotFoundException('Path not found');
    }
};

export function healthCheck(req: IncomingMessage, res: ServerResponse) {
    res.setHeader('content-type', 'application/json');
    res.writeHead(200);
    res.write(JSON.stringify({'health-check': 'success'}));
    res.end();
}

async function execute(req: IncomingMessage, res: ServerResponse, route: Route) {
    const middleware = new MiddlewareManager();
    middleware.use(loggingMiddleware);
    middleware.use(errorMiddleware);
    route.middlewares?.forEach(func => middleware.use(func));
    middleware.use(route.controller);
    await middleware.run(req, res);
}

http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const controller = await OrdersController.createInstance();
    const reqUrl = new URL(req.url || '', 'http://127.0.0.1/');
    const route = router(controller)[req.method + reqUrl.pathname] || notFound;
    await execute(req, res, route);
}).listen(3000, () => {
    console.log('Server is running at http://127.0.0.1:3000/');
});



