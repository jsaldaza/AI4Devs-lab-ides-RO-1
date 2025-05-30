export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

export interface LogContext {
    [key: string]: any;
}

export interface ILogger {
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, error?: Error, context?: LogContext): void;
    setContext(context: LogContext): void;
} 