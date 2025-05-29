import { getDataSource } from '../../infrastructure/database';
import { User } from '../../domain/entities/User';
import { LoginDto, RegisterDto, AuthResponse } from '../dtos/auth.dto';
import * as jwt from 'jsonwebtoken';
import { ApplicationError } from '../errors/ApplicationError';

export class AuthService {
    private userRepository = getDataSource().getRepository(User);
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private readonly JWT_EXPIRES_IN = '24h';

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        console.log('Attempting login for email:', loginDto.email);

        const user = await this.userRepository.findOne({
            where: { email: loginDto.email }
        });

        if (!user) {
            console.log('User not found:', loginDto.email);
            throw new ApplicationError('Credenciales inválidas', 401);
        }

        if (!user.isActive) {
            console.log('Inactive user attempted login:', loginDto.email);
            throw new ApplicationError('Usuario inactivo', 401);
        }

        const isPasswordValid = await user.validatePassword(loginDto.password);
        if (!isPasswordValid) {
            console.log('Invalid password for user:', loginDto.email);
            throw new ApplicationError('Credenciales inválidas', 401);
        }

        // Update last login
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);

        const token = this.generateToken(user);
        console.log('Login successful for user:', loginDto.email);

        return new AuthResponse(token, user);
    }

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        console.log('Attempting registration for email:', registerDto.email);

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email }
        });

        if (existingUser) {
            console.log('Registration failed - email exists:', registerDto.email);
            throw new ApplicationError('El usuario ya existe', 400);
        }

        // Create new user
        const user = this.userRepository.create({
            ...registerDto,
            isAdmin: false,
            isActive: true
        });

        // Save user (password will be hashed automatically via @BeforeInsert hook)
        const savedUser = await this.userRepository.save(user);
        console.log('Registration successful for user:', registerDto.email);

        const token = this.generateToken(savedUser);
        return new AuthResponse(token, savedUser);
    }

    async getUserById(userId: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId, isActive: true }
        });

        if (!user) {
            throw new ApplicationError('Usuario no encontrado', 404);
        }

        return user;
    }

    private generateToken(user: User): string {
        const payload = {
            userId: user.id,
            email: user.email,
            isAdmin: user.isAdmin
        };

        return jwt.sign(payload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN
        });
    }

    async validateToken(token: string): Promise<any> {
        try {
            const decoded = jwt.verify(token, this.JWT_SECRET);
            // Verificar que el usuario existe y está activo
            const user = await this.getUserById((decoded as any).userId);
            return decoded;
        } catch (error) {
            throw new ApplicationError('Token inválido', 401);
        }
    }
} 