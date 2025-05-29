import { Request, Response } from 'express';
import { AuthController } from '../AuthController';
import { AuthService } from '../../../application/services/auth.service';
import { User } from '../../../domain/entities/User';

// Mock AuthService
jest.mock('../../../application/services/auth.service');

describe('AuthController', () => {
    let authController: AuthController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockAuthService: jest.Mocked<AuthService>;

    beforeEach(() => {
        mockAuthService = new AuthService() as jest.Mocked<AuthService>;
        authController = new AuthController();

        mockRequest = {
            body: {},
            user: undefined,
        };

        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    describe('login', () => {
        const mockLoginData = {
            email: 'test@example.com',
            password: 'password123',
        };

        const mockLoginResponse = {
            token: 'mock_token',
            user: {
                id: 1,
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                isAdmin: false,
                isActive: true,
            },
        };

        it('should successfully login user', async () => {
            mockRequest.body = mockLoginData;
            (AuthService.prototype.login as jest.Mock).mockResolvedValue(mockLoginResponse);

            await authController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockLoginResponse,
            });
        });

        it('should handle login failure', async () => {
            mockRequest.body = mockLoginData;
            (AuthService.prototype.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

            await authController.login(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'Invalid credentials',
            });
        });
    });

    describe('register', () => {
        const mockRegisterData = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
        };

        const mockRegisterResponse = {
            token: 'mock_token',
            user: {
                id: 1,
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                isAdmin: false,
                isActive: true,
            },
        };

        it('should successfully register user', async () => {
            mockRequest.body = mockRegisterData;
            (AuthService.prototype.register as jest.Mock).mockResolvedValue(mockRegisterResponse);

            await authController.register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockRegisterResponse,
            });
        });

        it('should handle registration failure', async () => {
            mockRequest.body = mockRegisterData;
            (AuthService.prototype.register as jest.Mock).mockRejectedValue(new Error('User with this email already exists'));

            await authController.register(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'User with this email already exists',
            });
        });
    });

    describe('validate', () => {
        const mockUserId = 1;
        const mockUser: Partial<User> = {
            id: mockUserId,
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User',
            isAdmin: false,
            isActive: true,
        };

        it('should successfully validate token and return user', async () => {
            mockRequest.user = { userId: mockUserId };
            (AuthService.prototype.getUserById as jest.Mock).mockResolvedValue(mockUser);

            await authController.validate(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser,
            });
        });

        it('should handle missing user ID in token', async () => {
            mockRequest.user = undefined;

            await authController.validate(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'User ID not found in token',
            });
        });

        it('should handle user not found', async () => {
            mockRequest.user = { userId: mockUserId };
            (AuthService.prototype.getUserById as jest.Mock).mockRejectedValue(new Error('User not found'));

            await authController.validate(mockRequest as Request, mockResponse as Response);

            expect(mockResponse.status).toHaveBeenCalledWith(401);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: false,
                message: 'User not found',
            });
        });
    });
}); 