export enum OrderStatus {
    delivering = 'delivering',
    delivered = 'delivered',
}

export type Order = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    status?: OrderStatus;
}

export type OrderResponse = {
    order: Order;
}

export type OrdersResponse = {
    orders: Order[];
}
