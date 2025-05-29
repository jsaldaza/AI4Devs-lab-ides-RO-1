import { validate } from 'class-validator';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../dtos/user.dto';
import { User } from '../../domain/entities/User';
import { ApplicationError } from '../errors/ApplicationError';

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        // Validar DTO
        const errors = await validate(createUserDto);
        if (errors.length > 0) {
            throw new ApplicationError('Datos de usuario inválidos', 400, errors);
        }

        // Verificar si el email ya existe
        const existingUser = await this.userRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ApplicationError('El email ya está registrado', 400);
        }

        // Crear usuario
        const user = await this.userRepository.create({
            ...createUserDto,
            isAdmin: false,
            isActive: true
        });

        return UserResponseDto.fromEntity(user);
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        // Validar DTO
        const errors = await validate(updateUserDto);
        if (errors.length > 0) {
            throw new ApplicationError('Datos de actualización inválidos', 400, errors);
        }

        // Verificar si el usuario existe
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new ApplicationError('Usuario no encontrado', 404);
        }

        // Si se está actualizando el email, verificar que no exista
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const userWithEmail = await this.userRepository.findByEmail(updateUserDto.email);
            if (userWithEmail) {
                throw new ApplicationError('El email ya está en uso', 400);
            }
        }

        // Actualizar usuario
        const updatedUser = await this.userRepository.update(id, updateUserDto);
        return UserResponseDto.fromEntity(updatedUser);
    }

    async getUser(id: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApplicationError('Usuario no encontrado', 404);
        }
        return UserResponseDto.fromEntity(user);
    }

    async getAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.findAll();
        return users.map(user => UserResponseDto.fromEntity(user));
    }

    async getActiveUsers(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.findActive();
        return users.map(user => UserResponseDto.fromEntity(user));
    }

    async deleteUser(id: number): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApplicationError('Usuario no encontrado', 404);
        }
        await this.userRepository.delete(id);
    }

    async deactivateUser(id: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new ApplicationError('Usuario no encontrado', 404);
        }

        user.deactivate();
        const updatedUser = await this.userRepository.update(id, user);
        return UserResponseDto.fromEntity(updatedUser);
    }
} 