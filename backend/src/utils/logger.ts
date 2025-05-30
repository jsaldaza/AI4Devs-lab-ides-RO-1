import winston from 'winston';

export class Logger {
    private static instance: Logger;
    private logger: winston.Logger;

    private constructor() {
        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            defaultMeta: { service: 'auth-service' },
            transports: [
                new winston.transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                }),
                new winston.transports.File({
                    filename: 'logs/combined.log',
                    maxsize: 5242880, // 5MB
                    maxFiles: 5,
                })
            ]
        });

        // If we're not in production, log to the console
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }));
        }
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatMessage(message: string, meta?: any): any {
        return {
            message,
            timestamp: new Date().toISOString(),
            ...meta
        };
    }

    public debug(message: string, meta?: any): void {
        this.logger.debug(this.formatMessage(message, meta));
    }

    public info(message: string, meta?: any): void {
        this.logger.info(this.formatMessage(message, meta));
    }

    public warn(message: string, meta?: any): void {
        this.logger.warn(this.formatMessage(message, meta));
    }

    public error(message: string, error?: Error | any, meta?: any): void {
        const errorMeta = {
            ...meta,
            error: error instanceof Error ? {
                name: error.name,
                message: error.message,
                stack: error.stack
            } : error
        };
        this.logger.error(this.formatMessage(message, errorMeta));
    }

    public setContext(context: Record<string, any>): void {
        this.logger.defaultMeta = {
            ...this.logger.defaultMeta,
            ...context
        };
    }

    // Método para limpiar datos sensibles antes de loggear
    private sanitizeData(data: any): any {
        const sensitiveFields = ['password', 'token', 'secret', 'creditCard'];

        if (!data) return data;

        if (typeof data === 'object') {
            const sanitized = { ...data };
            for (const field of sensitiveFields) {
                if (field in sanitized) {
                    sanitized[field] = '[REDACTED]';
                }
            }
            return sanitized;
        }

        return data;
    }

    // Método para loggear métricas
    public metric(name: string, value: number, tags?: Record<string, string>): void {
        this.logger.info(this.formatMessage('metric', {
            metric: name,
            value,
            tags
        }));
    }

    // Método para loggear eventos de seguridad
    public security(event: string, meta?: any): void {
        this.logger.warn(this.formatMessage(`Security Event: ${event}`, {
            securityEvent: true,
            ...this.sanitizeData(meta)
        }));
    }
} 