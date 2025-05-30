import { Request, Response } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { IAuthService } from '../../application/interfaces/IAuthService';
import { LoginDto, RegisterDto } from '../../application/dtos/auth.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Logger } from '../logging/Logger';
import { getDataSource } from '../database';
import { User } from '../../domain/entities/User';

export class AuthController {
    private authService: IAuthService;
    private readonly logger = Logger.getInstance();
    private readonly userRepository = getDataSource().getRepository(User);

    constructor() {
        const userRepository = getDataSource().getRepository(User);
        this.authService = new AuthService(userRepository);
        this.logger.setContext({ controller: 'AuthController' });
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            this.logger.debug('Processing login request', { email: req.body.email });

            // Convertir y validar el DTO
            const loginDto = plainToClass(LoginDto, req.body);
            const errors = await validate(loginDto);

            if (errors.length > 0) {
                this.logger.warn('Login validation failed', {
                    email: req.body.email,
                    errors: errors.map(error => ({
                        property: error.property,
                        constraints: error.constraints
                    }))
                });

                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.map(error => ({
                        property: error.property,
                        constraints: error.constraints
                    }))
                });
                return;
            }

            const result = await this.authService.login(loginDto);
            this.logger.info('Login processed successfully', { email: req.body.email });

            res.json({
                success: true,
                data: result
            });
        } catch (error: any) {
            this.logger.error('Login request failed', error, { email: req.body.email });
            res.status(401).json({
                success: false,
                message: error.message || 'Authentication failed'
            });
        }
    };

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            this.logger.debug('Processing registration request', { email: req.body.email });

            // Convertir y validar el DTO
            const registerDto = plainToClass(RegisterDto, req.body);
            const errors = await validate(registerDto);

            if (errors.length > 0) {
                this.logger.warn('Registration validation failed', {
                    email: req.body.email,
                    errors: errors.map(error => ({
                        property: error.property,
                        constraints: error.constraints
                    }))
                });

                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.map(error => ({
                        property: error.property,
                        constraints: error.constraints
                    }))
                });
                return;
            }

            this.logger.info('Registration attempt initiated', { email: req.body.email });
            const result = await this.authService.register(registerDto);
            this.logger.info('Registration successful', { email: req.body.email, userId: result.user.id });

            res.status(201).json({
                success: true,
                data: result
            });
        } catch (error: any) {
            this.logger.error('Registration failed', error, { email: req.body.email });
            res.status(400).json({
                success: false,
                message: error.message || 'Registration failed'
            });
        }
    };

    validate = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user?.userId;
            this.logger.debug('Processing token validation request', { userId });

            if (!userId) {
                this.logger.warn('Token validation failed - No user ID in token');
                throw new Error('User ID not found in token');
            }

            const user = await this.authService.getUserById(userId);
            this.logger.info('Token validation successful', { userId });

            res.json({ success: true, data: user });
        } catch (error: any) {
            this.logger.error('Token validation failed', error, { userId: req.user?.userId });
            res.status(401).json({
                success: false,
                message: error.message || 'Token validation failed'
            });
        }
    };

    deleteUserByEmail = async (req: Request, res: Response): Promise<void> => {
        try {
            const email = req.params.email;
            this.logger.debug('Processing user deletion request', { email });

            // Buscar el usuario por email
            const user = await this.userRepository.findOne({ where: { email } });

            if (!user) {
                this.logger.warn('User not found for deletion', { email });
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
                return;
            }

            // Eliminar el usuario
            await this.userRepository.remove(user);
            this.logger.info('User deleted successfully', { email });

            res.json({
                success: true,
                message: 'Usuario eliminado correctamente'
            });
        } catch (error: any) {
            this.logger.error('User deletion failed', error, { email: req.params.email });
            res.status(500).json({
                success: false,
                message: error.message || 'Error al eliminar el usuario'
            });
        }
    };
} 