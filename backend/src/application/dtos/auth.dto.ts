import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email!: string;

    @IsString()
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password!: string;
}

export class RegisterDto extends LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'First name is required' })
    firstName!: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name is required' })
    lastName!: string;
}

export class AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        isAdmin: boolean;
    };

    constructor(token: string, user: any) {
        this.token = token;
        this.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin
        };
    }
} 