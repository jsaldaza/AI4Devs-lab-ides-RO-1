import { Repository } from 'typeorm';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../application/interfaces/IUserRepository';
import { getDataSource } from '../database';

export class UserRepository implements IUserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getDataSource().getRepository(User);
    }

    async findOne(options: { where: any }): Promise<User | null> {
        return this.repository.findOne(options);
    }

    async save(user: User): Promise<User> {
        return this.repository.save(user);
    }

    create(userData: Partial<User>): User {
        return this.repository.create(userData);
    }

    async findById(id: number): Promise<User | null> {
        return await this.repository.findOne({
            where: { id }
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.repository.findOne({
            where: { email }
        });
    }

    async update(id: number, userData: Partial<User>): Promise<User> {
        await this.repository.update(id, userData);
        const updatedUser = await this.findById(id);
        if (!updatedUser) {
            throw new Error('User not found after update');
        }
        return updatedUser;
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async findAll(): Promise<User[]> {
        return await this.repository.find();
    }

    async findActive(): Promise<User[]> {
        return await this.repository.find({
            where: { isActive: true }
        });
    }
} 