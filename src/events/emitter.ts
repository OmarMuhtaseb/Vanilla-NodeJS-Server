import {EventEmitter} from 'events';
import TypedEmitter from 'typed-emitter';
import {Order} from '../orders';

export enum OrderEvents {
    statusUpdated = 'statusUpdated',
}

interface OrderEmitterEvents {
    statusUpdated: (data: Order) => void
}

class OrderEventEmitter extends (EventEmitter as new () => TypedEmitter<OrderEmitterEvents>) {
    constructor() {
        super();
    }
}

export default new OrderEventEmitter();
