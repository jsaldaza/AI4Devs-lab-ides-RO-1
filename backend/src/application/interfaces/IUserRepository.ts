import { User } from '../../domain/entities/User';

export interface IUserRepository {
    findOne(options: { where: any }): Promise<User | null>;
    save(user: User): Promise<User>;
    create(userData: Partial<User>): User;
} 