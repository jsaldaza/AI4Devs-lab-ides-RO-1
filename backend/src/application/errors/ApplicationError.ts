export class ApplicationError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly details?: any
    ) {
        super(message);
        this.name = 'ApplicationError';
        Object.setPrototypeOf(this, ApplicationError.prototype);
    }
} 