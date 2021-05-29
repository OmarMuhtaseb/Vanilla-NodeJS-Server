import {Dal, BaseRepository} from '../dal';
import {orderEventEmitter, OrderEvents} from '../events';
import {NotFoundException} from '../exception';
import {ExceptionMessages, ORDER_TABLE_NAME} from './constants';
import {Order, OrderStatus,} from './types';

export class OrdersService {
    private readonly repository: BaseRepository<Order>;

    private constructor(repository: BaseRepository<Order>) {
        this.repository = repository;
    }

    public static async createInstance(): Promise<OrdersService> {
        const repository = await Dal.createInstance(ORDER_TABLE_NAME);
        return new OrdersService(repository);
    }

    public async list({skip = 0, limit = 10, delivered = false}: { skip?: number, limit?: number, delivered: boolean }): Promise<Order[]> {
        const predicate = delivered ?
            (order: Order) => order.status === OrderStatus.delivered :
            (order: Order) => order.status !== OrderStatus.delivered;
        return await this.repository.list({skip, limit, predicate});
    }

    public async markAsDelivered(): Promise<Order> {
        const order = await this.repository.find((order: Order) => order.status !== OrderStatus.delivered);
        if (!order) {
            throw new NotFoundException(ExceptionMessages.ORDER_NOT_FOUND);
        }
        order.status = OrderStatus.delivered;
        await this.repository.updateById(order.id, order);
        orderEventEmitter.emit(OrderEvents.statusUpdated, order);
        return order;
    }
}
