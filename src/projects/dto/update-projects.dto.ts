import { PartialType } from '@nestjs/swagger';
import { CreateProjectDto } from './create-projects.dto';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdateProjectDto {
    @IsNotEmpty()
    id!: string;

    @IsNotEmpty()
    @MinLength(3)
    name!: string;
    
    @IsNotEmpty()
    referringEmployeeId!: string;
}
