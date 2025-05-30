import { ILogger, LogLevel, LogContext } from './ILogger';

export class Logger implements ILogger {
    private static instance: Logger;
    private context: LogContext = {};
    private readonly sensitiveFields = ['password', 'token', 'authorization', 'credit_card'];

    private constructor() { }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setContext(context: LogContext): void {
        this.context = { ...this.context, ...context };
    }

    debug(message: string, context?: LogContext): void {
        this.log(LogLevel.DEBUG, message, undefined, context);
    }

    info(message: string, context?: LogContext): void {
        this.log(LogLevel.INFO, message, undefined, context);
    }

    warn(message: string, context?: LogContext): void {
        this.log(LogLevel.WARN, message, undefined, context);
    }

    error(message: string, error?: Error, context?: LogContext): void {
        this.log(LogLevel.ERROR, message, error, context);
    }

    private log(level: LogLevel, message: string, error?: Error, context?: LogContext): void {
        const timestamp = new Date().toISOString();
        const sanitizedContext = this.sanitizeContext({ ...this.context, ...context });

        const logEntry = {
            timestamp,
            level,
            message,
            ...sanitizedContext,
            ...(error && {
                error: {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                }
            })
        };

        // En producción, aquí podríamos enviar los logs a un servicio externo
        if (process.env.NODE_ENV === 'production') {
            // TODO: Implementar envío a servicio de logging externo
            console.log(JSON.stringify(logEntry));
        } else {
            // En desarrollo, formateamos para mejor legibilidad
            const coloredLevel = this.getColoredLevel(level);
            console.log(`[${timestamp}] ${coloredLevel}: ${message}`);

            if (Object.keys(sanitizedContext).length > 0) {
                console.log('Context:', sanitizedContext);
            }

            if (error) {
                console.error('Error:', error);
            }
        }
    }

    private sanitizeContext(context: LogContext): LogContext {
        const sanitized = { ...context };

        const sanitizeValue = (value: any): any => {
            if (!value) return value;

            if (typeof value === 'object') {
                return this.sanitizeContext(value);
            }
            return '[REDACTED]';
        };

        const sanitizeObject = (obj: any): any => {
            const sanitized = { ...obj };
            for (const key in sanitized) {
                if (this.sensitiveFields.includes(key.toLowerCase())) {
                    sanitized[key] = '[REDACTED]';
                } else if (typeof sanitized[key] === 'object') {
                    sanitized[key] = sanitizeObject(sanitized[key]);
                }
            }
            return sanitized;
        };

        return sanitizeObject(sanitized);
    }

    private getColoredLevel(level: LogLevel): string {
        const colors = {
            [LogLevel.DEBUG]: '\x1b[36m', // Cyan
            [LogLevel.INFO]: '\x1b[32m',  // Green
            [LogLevel.WARN]: '\x1b[33m',  // Yellow
            [LogLevel.ERROR]: '\x1b[31m', // Red
        };

        const reset = '\x1b[0m';
        return `${colors[level]}${level}${reset}`;
    }
} 