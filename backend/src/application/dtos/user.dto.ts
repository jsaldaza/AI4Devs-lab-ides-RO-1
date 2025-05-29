import { IsEmail, IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';

// DTO para crear un usuario
export class CreateUserDto {
    @IsString({ message: 'El nombre debe ser texto' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    firstName!: string;

    @IsString({ message: 'El apellido debe ser texto' })
    @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    lastName!: string;

    @IsEmail({}, { message: 'El email debe ser válido' })
    email!: string;

    @IsString({ message: 'La contraseña debe ser texto' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password!: string;
}

// DTO para actualizar un usuario
export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'El nombre debe ser texto' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    firstName?: string;

    @IsOptional()
    @IsString({ message: 'El apellido debe ser texto' })
    @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    lastName?: string;

    @IsOptional()
    @IsEmail({}, { message: 'El email debe ser válido' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'La contraseña debe ser texto' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    password?: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser un valor booleano' })
    isActive?: boolean;
}

// DTO para respuestas de usuario
export class UserResponseDto {
    id!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    isAdmin!: boolean;
    isActive!: boolean;
    lastLoginAt?: Date;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }

    static fromEntity(user: any): UserResponseDto {
        return new UserResponseDto({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }
} 