import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { User } from '../../domain/entities/User';
import { Logger } from '../../utils/logger';
import { ApplicationError } from '../errors/ApplicationError';

export class TokenService {
    private readonly logger = Logger.getInstance();
    private readonly secretKey: Secret;
    private readonly tokenExpiration: string;

    constructor() {
        this.secretKey = process.env.JWT_SECRET || 'your-secret-key';
        this.tokenExpiration = process.env.JWT_EXPIRATION || '24h';

        if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
            this.logger.warn('JWT_SECRET not set in production environment');
        }
    }

    generateToken(user: User): string {
        try {
            const payload = {
                userId: user.id,
                email: user.email,
                isAdmin: user.isAdmin
            };

            const signOptions = {
                expiresIn: this.tokenExpiration
            } as SignOptions;

            return jwt.sign(payload, this.secretKey, signOptions);
        } catch (error) {
            this.logger.error('Error generating token:', error);
            throw new ApplicationError('Error al generar el token', 500);
        }
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secretKey);
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApplicationError('Token expirado', 401);
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ApplicationError('Token inválido', 401);
            }
            this.logger.error('Error verifying token:', error);
            throw new ApplicationError('Error al verificar el token', 500);
        }
    }

    decodeToken(token: string): any {
        try {
            return jwt.decode(token);
        } catch (error) {
            this.logger.error('Error decoding token:', error);
            throw new ApplicationError('Error al decodificar el token', 500);
        }
    }

    refreshToken(oldToken: string): string {
        try {
            const decoded = this.verifyToken(oldToken);
            delete decoded.iat;
            delete decoded.exp;

            const signOptions = {
                expiresIn: this.tokenExpiration
            } as SignOptions;

            return jwt.sign(decoded, this.secretKey, signOptions);
        } catch (error) {
            this.logger.error('Error refreshing token:', error);
            throw new ApplicationError('Error al refrescar el token', 500);
        }
    }
} 