export type Route = {
    controller: Function;
    middlewares?: Function[];
}

export type ExceptionResponse = {
    error: {
        code: number
        message: string;
        path?: string;
    };
}
