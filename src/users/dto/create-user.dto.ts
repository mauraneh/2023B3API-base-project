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
export function isUUID(value: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }
