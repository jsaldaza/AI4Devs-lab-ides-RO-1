import { AxiosError } from 'axios';

export enum ErrorType {
    VALIDATION = 'VALIDATION',
    AUTHENTICATION = 'AUTHENTICATION',
    AUTHORIZATION = 'AUTHORIZATION',
    NETWORK = 'NETWORK',
    SERVER = 'SERVER',
    RATE_LIMIT = 'RATE_LIMIT',
    UNKNOWN = 'UNKNOWN'
}

export interface AppError {
    type: ErrorType;
    message: string;
    details?: Record<string, any>;
    statusCode?: number;
}

class ErrorService {
    private static instance: ErrorService;

    private constructor() { }

    static getInstance(): ErrorService {
        if (!ErrorService.instance) {
            ErrorService.instance = new ErrorService();
        }
        return ErrorService.instance;
    }

    parseAxiosError(error: AxiosError): AppError {
        if (!error.response) {
            return {
                type: ErrorType.NETWORK,
                message: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.',
                details: { originalError: error.message }
            };
        }

        const statusCode = error.response.status;
        const responseData = error.response.data as any;

        switch (statusCode) {
            case 400:
                return {
                    type: ErrorType.VALIDATION,
                    message: responseData.message || 'Datos de entrada inválidos',
                    details: responseData.errors,
                    statusCode
                };
            case 401:
                return {
                    type: ErrorType.AUTHENTICATION,
                    message: 'Sesión expirada o credenciales inválidas',
                    statusCode
                };
            case 403:
                return {
                    type: ErrorType.AUTHORIZATION,
                    message: 'No tienes permisos para realizar esta acción',
                    statusCode
                };
            case 429:
                return {
                    type: ErrorType.RATE_LIMIT,
                    message: 'Has excedido el límite de intentos. Por favor, espera unos minutos.',
                    statusCode
                };
            case 500:
                return {
                    type: ErrorType.SERVER,
                    message: 'Error interno del servidor. Por favor, intenta más tarde.',
                    statusCode
                };
            default:
                return {
                    type: ErrorType.UNKNOWN,
                    message: responseData.message || 'Ha ocurrido un error inesperado',
                    statusCode
                };
        }
    }

    getErrorMessage(error: AppError): string {
        return error.message;
    }

    isAuthenticationError(error: AppError): boolean {
        return error.type === ErrorType.AUTHENTICATION;
    }

    isValidationError(error: AppError): boolean {
        return error.type === ErrorType.VALIDATION;
    }

    isNetworkError(error: AppError): boolean {
        return error.type === ErrorType.NETWORK;
    }

    getValidationErrors(error: AppError): Record<string, string[]> | undefined {
        if (this.isValidationError(error)) {
            return error.details as Record<string, string[]>;
        }
        return undefined;
    }
}

export const errorService = ErrorService.getInstance(); 