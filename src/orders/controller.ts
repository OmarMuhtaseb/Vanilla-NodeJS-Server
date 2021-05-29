import {IncomingMessage, ServerResponse} from 'http';
import {Utils} from '../utils';
import {OrdersService} from './service';
import {OrderResponse, OrdersResponse} from './types';

export class OrdersController {
    private readonly service;

    private constructor(service: OrdersService) {
        this.service = service;
    }

    public static async createInstance(): Promise<OrdersController> {
        const service = await OrdersService.createInstance();
        return new OrdersController(service);
    }

    public async list(req: IncomingMessage, res: ServerResponse) {
        const {skip, limit, delivered} = Utils.getQueryParams(req.url);
        const orders = await this.service.list({
            ...(skip && typeof skip === 'string' && {skip: Number.parseInt(skip)}),
            ...(limit && typeof limit === 'string' && {limit: Number.parseInt(limit)}),
            delivered: typeof delivered === 'string' && delivered.toLowerCase() === 'true',
        });

        const response: OrdersResponse = {orders};
        OrdersController.sendResponse(response, res);
    }

    public async markAsDelivered(req: IncomingMessage, res: ServerResponse) {
        const order = await this.service.markAsDelivered();
        const response: OrderResponse = {order};
        OrdersController.sendResponse(response, res);
    }

    private static sendResponse(data: any, res: ServerResponse): void {
        res.setHeader('content-type', 'application/json');
        res.writeHead(200);
        res.write(JSON.stringify(data));
        res.end();
    }
}
