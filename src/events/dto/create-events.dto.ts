import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { EventStatus, EventType } from '../enums';


export class CreateEventsDto {
  @IsDateString()
  date: Date;

  @IsEnum(EventStatus)
  @IsOptional()
  eventStatus?: EventStatus;

  @IsEnum(EventType)
  eventType: EventType;

  @IsString()
  @IsOptional()
  eventDescription?: string;
}
