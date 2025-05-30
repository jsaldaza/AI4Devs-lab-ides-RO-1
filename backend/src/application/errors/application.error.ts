export class ApplicationError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 500,
        public readonly details?: Record<string, any>
    ) {
        super(message);
        this.name = 'ApplicationError';
        Object.setPrototypeOf(this, ApplicationError.prototype);
    }

    toJSON() {
        return {
            error: this.name,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details
        };
    }
} 