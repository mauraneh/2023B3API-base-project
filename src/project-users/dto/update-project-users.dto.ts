import { IsNotEmpty } from 'class-validator';

export class UpdateProjectUsersDto {
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
