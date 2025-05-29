import { Request, Response } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { LoginDto, RegisterDto } from '../../application/dtos/auth.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('Login attempt:', { email: req.body.email });

            // Convertir y validar el DTO
            const loginDto = plainToClass(LoginDto, req.body);
            const errors = await validate(loginDto);

            if (errors.length > 0) {
                console.log('Validation errors:', errors);
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
            console.log('Login successful:', { email: req.body.email });

            res.json({
                success: true,
                data: result
            });
        } catch (error: any) {
            console.error('Login error:', error);
            res.status(401).json({
                success: false,
                message: error.message || 'Authentication failed'
            });
        }
    };

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const registerDto = plainToClass(RegisterDto, req.body);
            const errors = await validate(registerDto);

            if (errors.length > 0) {
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

            const result = await this.authService.register(registerDto);
            res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            console.error('Registration error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Registration failed'
            });
        }
    };

    validate = async (req: Request, res: Response): Promise<void> => {
        try {
            // The user object is attached by the auth middleware
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('User ID not found in token');
            }

            const user = await this.authService.getUserById(userId);
            res.json({ success: true, data: user });
        } catch (error: any) {
            console.error('Token validation error:', error);
            res.status(401).json({
                success: false,
                message: error.message || 'Token validation failed'
            });
        }
    };
} 