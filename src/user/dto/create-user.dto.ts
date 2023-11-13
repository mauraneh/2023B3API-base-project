import { Entity } from 'typeorm';
import { UserRoleEnum } from '../entities/user.entity';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Entity()
export class CreateUserDto {
    @MinLength(3)
    @IsNotEmpty()
    public username!: string
    @IsEmail()
    @IsNotEmpty()
    public email!: string
    @MinLength(8)
    @IsNotEmpty()
    public password!: string;
    public role: UserRoleEnum;
}
