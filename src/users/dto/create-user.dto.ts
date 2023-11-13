import { Entity } from 'typeorm';
import { UserRole } from '../entities/user.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';


@Entity()
export class CreateUserDto {
    @MinLength(3)
    @IsNotEmpty()
    public username!: string;

    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @MinLength(8)
    @IsNotEmpty()
    public password!: string;

    @IsEnum(UserRole)
    @IsOptional()
    public role?: UserRole;
}

