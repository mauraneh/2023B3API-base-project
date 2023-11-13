import { Entity } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';


@Entity()
export class LogInTo {
    @IsEmail()
    @IsNotEmpty()
    public email!: string

    @IsNotEmpty()
    public password!: string;
}