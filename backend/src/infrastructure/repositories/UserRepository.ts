import { Repository } from 'typeorm';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { getDataSource } from '../database';

export class UserRepository implements IUserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = getDataSource().getRepository(User);
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

    async create(userData: Partial<User>): Promise<User> {
        const user = this.repository.create(userData);
        return await this.repository.save(user);
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