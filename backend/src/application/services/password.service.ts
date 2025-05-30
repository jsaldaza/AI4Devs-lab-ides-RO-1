import * as bcrypt from 'bcryptjs';
import { Logger } from '../../infrastructure/logging/Logger';

export class PasswordService {
    private readonly SALT_ROUNDS = 12;
    private readonly MIN_PASSWORD_LENGTH = 8;
    private readonly logger = Logger.getInstance();

    constructor() {
        this.logger.setContext({ service: 'PasswordService' });
    }

    async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            this.logger.error('Error hashing password', error as Error);
            throw new Error('Error al procesar la contraseña');
        }
    }

    async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            this.logger.error('Error validating password', error as Error);
            return false;
        }
    }

    isValidPasswordFormat(password: string): boolean {
        if (password.length < this.MIN_PASSWORD_LENGTH) {
            return false;
        }

        // Al menos una letra mayúscula
        if (!/[A-Z]/.test(password)) {
            return false;
        }

        // Al menos una letra minúscula
        if (!/[a-z]/.test(password)) {
            return false;
        }

        // Al menos un número
        if (!/[0-9]/.test(password)) {
            return false;
        }

        // Al menos un carácter especial
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return false;
        }

        return true;
    }

    getPasswordValidationErrors(password: string): string[] {
        const errors: string[] = [];

        if (password.length < this.MIN_PASSWORD_LENGTH) {
            errors.push(`La contraseña debe tener al menos ${this.MIN_PASSWORD_LENGTH} caracteres`);
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una letra mayúscula');
        }

        if (!/[a-z]/.test(password)) {
            errors.push('La contraseña debe contener al menos una letra minúscula');
        }

        if (!/[0-9]/.test(password)) {
            errors.push('La contraseña debe contener al menos un número');
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('La contraseña debe contener al menos un carácter especial');
        }

        return errors;
    }
} 