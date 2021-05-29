import {IncomingMessage, ServerResponse} from 'http';

export class MiddlewareManager {
    private readonly middlewares: Function[];

    constructor() {
        this.middlewares = [];
    }

    use(func: Function) {
        this.middlewares.push(func);
    }

    async executeMiddleware(req: IncomingMessage, res: ServerResponse) {
        const runner = async (index: number) => {
            const middleware = this.middlewares[index];
            if (middleware) {
                await middleware(req, res, () => {
                    return runner(index + 1);
                });
            }
        };
        await runner(0);
    }

    async run(req: IncomingMessage, res: ServerResponse) {
        await this.executeMiddleware(req, res);
    }
}
