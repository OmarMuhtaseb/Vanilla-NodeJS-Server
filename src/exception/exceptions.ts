export class Exception extends Error {
    public httpCode: number;

    constructor(httpCode: number, message: string) {
        super(message);
        this.httpCode = httpCode;
        Error.captureStackTrace(this);
    }
}


export class BadRequestException extends Exception {
    constructor(message = 'Bad Request') {
        super(HttpStatusCode.BAD_REQUEST, message);
    }
}

export class UnAuthenticatedException extends Exception {
    constructor(message = 'UNAUTHORIZED') {
        super(HttpStatusCode.UNAUTHORIZED, message);
    }
}

export class NotFoundException extends Exception {
    constructor(message: string) {
        super(HttpStatusCode.NOT_FOUND, message);
    }
}

export class LockedResource extends Exception {
    constructor(message: string) {
        super(HttpStatusCode.LOCKED, message);
    }
}

export enum HttpStatusCode {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    LOCKED = 423,
    INTERNAL_SERVER = 500,
}
