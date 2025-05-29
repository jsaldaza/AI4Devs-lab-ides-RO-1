import { User } from '../entities/User';

export interface IUserRepository {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: Partial<User>): Promise<User>;
    update(id: number, userData: Partial<User>): Promise<User>;
    delete(id: number): Promise<void>;
    findAll(): Promise<User[]>;
    findActive(): Promise<User[]>;
} 