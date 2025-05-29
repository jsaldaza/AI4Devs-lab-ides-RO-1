import { AuthService } from '../auth.service';
import { User } from '../../../domain/entities/User';
import { LoginDto, RegisterDto } from '../../dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Mock getDataSource
const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
};

jest.mock('../../../infrastructure/database', () => ({
    getDataSource: () => ({
        getRepository: () => mockUserRepository
    })
}));

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        // Limpiar todos los mocks
        jest.clearAllMocks();
        authService = new AuthService();
    });

    describe('login', () => {
        const mockLoginDto: LoginDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        const mockUser = {
            id: 1,
            email: 'test@example.com',
            password: 'hashedPassword',
            firstName: 'Test',
            lastName: 'User',
            isAdmin: false,
            isActive: true,
            validatePassword: jest.fn().mockResolvedValue(true),
            lastLoginAt: new Date(),
        };

        it('should successfully login with valid credentials', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            mockUserRepository.save.mockResolvedValue(mockUser);

            const result = await authService.login(mockLoginDto);

            expect(result).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.user).toBeDefined();
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email: mockLoginDto.email, isActive: true }
            });
            expect(mockUser.validatePassword).toHaveBeenCalledWith(mockLoginDto.password);
        });

        it('should throw error when user not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(authService.login(mockLoginDto)).rejects.toThrow('Invalid credentials');
        });

        it('should throw error when password is invalid', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            mockUser.validatePassword.mockResolvedValue(false);

            await expect(authService.login(mockLoginDto)).rejects.toThrow('Invalid credentials');
        });
    });

    describe('register', () => {
        const mockRegisterDto: RegisterDto = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
        };

        const mockUser = {
            id: 1,
            ...mockRegisterDto,
            isAdmin: false,
            isActive: true,
            password: 'hashedPassword',
            validatePassword: jest.fn(),
            lastLoginAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should successfully register a new user', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(mockUser);
            mockUserRepository.save.mockResolvedValue(mockUser);

            const result = await authService.register(mockRegisterDto);

            expect(result).toBeDefined();
            expect(result.token).toBeDefined();
            expect(result.user).toBeDefined();
            expect(mockUserRepository.create).toHaveBeenCalledWith({
                ...mockRegisterDto,
                isAdmin: false,
                isActive: true
            });
            expect(mockUserRepository.save).toHaveBeenCalled();
        });

        it('should throw error when email already exists', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            await expect(authService.register(mockRegisterDto)).rejects.toThrow('User with this email already exists');
        });
    });

    describe('validateToken', () => {
        const mockToken = 'valid_token';
        const mockDecodedToken = { userId: 1 };

        it('should successfully validate a token', async () => {
            (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);

            const result = await authService.validateToken(mockToken);

            expect(result).toBeDefined();
            expect(result).toEqual(mockDecodedToken);
            expect(jwt.verify).toHaveBeenCalledWith(mockToken, expect.any(String));
        });

        it('should throw error when token is invalid', async () => {
            (jwt.verify as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await expect(authService.validateToken(mockToken)).rejects.toThrow('Invalid token');
        });
    });

    describe('getUserById', () => {
        const userId = 1;
        const mockUser = {
            id: userId,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            isAdmin: false,
            isActive: true,
            password: 'hashedPassword',
            lastLoginAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should successfully return user by id', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await authService.getUserById(userId);

            expect(result).toEqual(mockUser);
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { id: userId, isActive: true }
            });
        });

        it('should throw error when user not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(authService.getUserById(userId)).rejects.toThrow('User not found');
        });
    });
}); 