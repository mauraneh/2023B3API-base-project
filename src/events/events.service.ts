import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from './entities/events.entity';
import { CreateEventsDto } from './dto/create-events.dto';
import * as dayjs from 'dayjs';
import { EventStatus, EventType } from './enums';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private repository: Repository<Events>,
  ) {}

  async create(userId: string, dto: CreateEventsDto): Promise<Events> {
    const existingEvent = await this.repository.findOne({
      where: { userId: userId, date: dto.date },
    });

    if (existingEvent) {
      throw new UnauthorizedException('Event already exists on this day');
    }

    if (dto.eventType === EventType.RemoteWork) {
      await this.validateRemoteWorkLimit(userId, dto.date);
      dto.eventStatus = EventStatus.Accepted;
    }

    if (dto.eventType === EventType.PaidLeave && !dto.eventStatus) {
      dto.eventStatus = EventStatus.Pending;
    }

    const newEvent = this.repository.create({ ...dto, userId: userId });
    return await this.repository.save(newEvent);
  }

  async findById(eventId: string): Promise<Events> {
    const event = await this.repository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async findAll(): Promise<Events[]> {
    return await this.repository.find();
  }

  async approve(eventId: string): Promise<void> {
    await this.updateEventStatus(eventId, EventStatus.Accepted);
  }

  async reject(eventId: string): Promise<void> {
    await this.updateEventStatus(eventId, EventStatus.Declined);
  }

  async countAcceptedLeaves(userId: string, month: number): Promise<number> {
    const startOfMonth = dayjs().month(month - 1).startOf('month').toDate();
    const endOfMonth = dayjs().month(month - 1).endOf('month').toDate();

    return await this.repository.count({
      where: {
        userId: userId,
        date: Between(startOfMonth, endOfMonth),
        eventStatus: EventStatus.Accepted,
      },
    });
  }

  // Private helper methods
  private async validateRemoteWorkLimit(userId: string, date: Date): Promise<void> {
    const weekStart = dayjs(date).startOf('week').toDate();
    const weekEnd = dayjs(date).endOf('week').toDate();

    const count = await this.repository.count({
      where: {
        userId: userId,
        eventType: EventType.RemoteWork,
        date: Between(weekStart, weekEnd),
      },
    });

    if (count >= 2) {
      throw new BadRequestException('Remote work limit reached for the week');
    }
  }

  private async updateEventStatus(eventId: string, status: EventStatus): Promise<void> {
    await this.repository.update(eventId, { eventStatus: status });
  }
}
