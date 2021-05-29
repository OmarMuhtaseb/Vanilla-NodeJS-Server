import {v4 as uuid} from 'uuid';
import {Dal, BaseRepository} from '../dal';
import {orderEventEmitter, OrderEvents} from '../events';
import {Order} from '../orders';
import {EVENTS_TABLE_NAME} from './constants';
import {Stats} from './types';

export class StatsService {
    private readonly repository: BaseRepository<Stats>;

    constructor(repository: BaseRepository<Stats>) {
        this.repository = repository;
        orderEventEmitter.on(OrderEvents.statusUpdated, (order: Order) => this.handleStatusUpdate(order));
    }

    public static async createInstance(): Promise<StatsService> {
        const repository = await Dal.createInstance(EVENTS_TABLE_NAME);
        return new StatsService(repository);
    }

    private async handleStatusUpdate(order: Order): Promise<void> {
        let record = await this.repository.find();
        if (!record) {
            await this.repository.insert({
                id: uuid(),
                total: 1
            });
        } else {
            await this.repository.updateById(record.id, {...record, total: record.total + 1});
        }
    }
}

(async () => await StatsService.createInstance())();
