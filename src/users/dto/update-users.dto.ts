import { PartialType } from '@nestjs/swagger';
import { CreateUsersDto } from './create-users.dto';

export class UpdateUserDto extends PartialType(CreateUsersDto) {}
