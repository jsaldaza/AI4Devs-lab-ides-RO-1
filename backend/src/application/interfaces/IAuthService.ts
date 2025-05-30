import { LoginDto, RegisterDto, AuthResponse } from '../dtos/auth.dto';
import { User } from '../../domain/entities/User';

export interface IAuthService {
    login(loginDto: LoginDto): Promise<AuthResponse>;
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    validateToken(token: string): Promise<any>;
    getUserById(userId: number): Promise<User>;
} 