import { IsNotEmpty } from 'class-validator';

export class UpdateProjectUserDto {
    @IsNotEmpty()
    id: string;

    @IsNotEmpty()
    startDate: Date;

    @IsNotEmpty()
    endDate: Date;

    @IsNotEmpty()
    userId: string;

    @IsNotEmpty()
    projectId: string;
}
