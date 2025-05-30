import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Logger } from '../../infrastructure/logging/Logger';
import { ApplicationError } from '../errors/ApplicationError';

export interface ValidationResult<T> {
    isValid: boolean;
    data?: T;
    errors?: ValidationErrorResponse[];
}

export interface ValidationErrorResponse {
    property: string;
    constraints: { [type: string]: string };
}

export class ValidationService {
    private readonly logger = Logger.getInstance();

    constructor() {
        this.logger.setContext({ service: 'ValidationService' });
    }

    async validateDTO<T extends object>(
        dto: any,
        DtoClass: new () => T,
        context?: string
    ): Promise<ValidationResult<T>> {
        try {
            const dtoInstance = plainToClass(DtoClass, dto);
            const errors = await validate(dtoInstance);

            if (errors.length > 0) {
                const formattedErrors = this.formatValidationErrors(errors);
                this.logger.warn('Validation failed', {
                    context,
                    errors: formattedErrors
                });

                return {
                    isValid: false,
                    errors: formattedErrors
                };
            }

            return {
                isValid: true,
                data: dtoInstance
            };
        } catch (error) {
            this.logger.error('Validation processing error', error as Error, { context });
            throw new ApplicationError('Error procesando la validación', 400);
        }
    }

    private formatValidationErrors(errors: ValidationError[]): ValidationErrorResponse[] {
        return errors.map(error => ({
            property: error.property,
            constraints: error.constraints || {}
        }));
    }

    formatErrorResponse(errors: ValidationErrorResponse[]): object {
        return {
            success: false,
            message: 'Validation failed',
            errors: errors.map(error => ({
                property: error.property,
                constraints: error.constraints
            }))
        };
    }
} 