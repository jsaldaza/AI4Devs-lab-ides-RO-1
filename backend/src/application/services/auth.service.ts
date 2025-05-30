import { User } from '../../domain/entities/User';
import { LoginDto, RegisterDto, AuthResponse } from '../dtos/auth.dto';
import { ApplicationError } from '../errors/ApplicationError';
import { IAuthService } from '../interfaces/IAuthService';
import { IUserRepository } from '../interfaces/IUserRepository';
import { Logger } from '../../infrastructure/logging/Logger';
import { TokenService } from './token.service';
import { PasswordService } from './password.service';
import { CacheService } from '../../infrastructure/services/cache.service';
import { Repository } from 'typeorm';

export class AuthService implements IAuthService {
    private readonly logger = Logger.getInstance();
    private readonly cacheService = CacheService.getInstance();
    private readonly userCacheTTL = 3600; // 1 hour
    private readonly tokenBlacklistTTL = 86400; // 24 hours
    private readonly tokenService: TokenService;
    private readonly passwordService: PasswordService;

    constructor(
        private readonly userRepository: Repository<User>
    ) {
        this.tokenService = new TokenService();
        this.passwordService = new PasswordService();
    }

    private getUserCacheKey(userId: number): string {
        return `user:${userId}`;
    }

    private getTokenBlacklistKey(token: string): string {
        return `blacklist:${token}`;
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        this.logger.info('Login attempt initiated', { email: loginDto.email });

        const user = await this.userRepository.findOne({
            where: { email: loginDto.email }
        });

        if (!user) {
            this.logger.warn('Login failed - User not found', { email: loginDto.email });
            throw new ApplicationError('Credenciales inválidas', 401);
        }

        if (!user.isActive) {
            this.logger.warn('Login failed - Inactive user', { email: loginDto.email });
            throw new ApplicationError('Usuario inactivo', 401);
        }

        const isPasswordValid = await this.passwordService.validatePassword(
            loginDto.password,
            user.password
        );

        if (!isPasswordValid) {
            this.logger.warn('Login failed - Invalid password', { email: loginDto.email });
            throw new ApplicationError('Credenciales inválidas', 401);
        }

        // Update last login and cache user data
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);
        await this.cacheService.set(
            this.getUserCacheKey(user.id),
            user,
            { ttl: this.userCacheTTL }
        );

        const token = this.tokenService.generateToken(user);
        this.logger.info('Login successful', { email: loginDto.email, userId: user.id });

        return new AuthResponse(token, user);
    }

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        this.logger.info('Registration attempt initiated', { email: registerDto.email });

        // Validate password format
        if (!this.passwordService.isValidPasswordFormat(registerDto.password)) {
            const errors = this.passwordService.getPasswordValidationErrors(registerDto.password);
            this.logger.warn('Registration failed - Invalid password format', {
                email: registerDto.email,
                errors
            });
            throw new ApplicationError(errors.join('. '), 400);
        }

        // Check if user already exists
        const existingUser = await this.userRepository.findOne({
            where: { email: registerDto.email }
        });

        if (existingUser) {
            this.logger.warn('Registration failed - Email exists', { email: registerDto.email });
            throw new ApplicationError('El usuario ya existe', 400);
        }

        // Hash password
        const hashedPassword = await this.passwordService.hashPassword(registerDto.password);

        // Create new user
        const user = this.userRepository.create({
            ...registerDto,
            password: hashedPassword,
            isAdmin: false,
            isActive: true
        });

        // Save user
        const savedUser = await this.userRepository.save(user);
        await this.cacheService.set(
            this.getUserCacheKey(savedUser.id),
            savedUser,
            { ttl: this.userCacheTTL }
        );

        this.logger.info('Registration successful', {
            email: registerDto.email,
            userId: savedUser.id
        });

        const token = this.tokenService.generateToken(savedUser);
        return new AuthResponse(token, savedUser);
    }

    async getUserById(userId: number): Promise<User> {
        // Try to get user from cache first
        const cachedUser = await this.cacheService.get<User>(this.getUserCacheKey(userId));
        if (cachedUser) {
            return cachedUser;
        }

        // If not in cache, get from database
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            this.logger.warn('User not found', { userId });
            throw new ApplicationError('Usuario no encontrado', 404);
        }

        // Cache the user data
        await this.cacheService.set(
            this.getUserCacheKey(userId),
            user,
            { ttl: this.userCacheTTL }
        );

        return user;
    }

    async logout(token: string): Promise<void> {
        // Add token to blacklist
        await this.cacheService.set(
            this.getTokenBlacklistKey(token),
            true,
            { ttl: this.tokenBlacklistTTL }
        );
        this.logger.info('User logged out successfully');
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
        return await this.cacheService.exists(this.getTokenBlacklistKey(token));
    }

    async validateToken(token: string): Promise<any> {
        // Check if token is blacklisted
        const isBlacklisted = await this.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new ApplicationError('Token inválido o expirado', 401);
        }

        return this.tokenService.verifyToken(token);
    }
} 