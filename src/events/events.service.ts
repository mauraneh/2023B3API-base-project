import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Events } from './entities/events.entity';
import { CreateEventsDto } from './dto/create-events.dto';
import * as dayjs from 'dayjs';
import { EventStatus, EventType } from './enums';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Events)
    private eventsRepository: Repository<Events>,
  ) {}

  async createNewEvent(
    userId: string,
    eventDetails: CreateEventsDto,
  ): Promise<Events | null> {
    // Rule: No two events, regardless of their status, can occur on the same day
    const searchOptions: FindManyOptions<Events> = {
      where: {
        userId: userId,
        date: eventDetails.date,
      },
      relations: ['user'],
    };
    const existingEventOnSameDay = await this.eventsRepository.findOne(searchOptions);
  
    if (existingEventOnSameDay !== null) {
      throw new UnauthorizedException(
        'An event already exists for this user on the same day',
      );
    }
    // Rule: Remote work cannot exceed two days per week
    if (eventDetails.eventType === 'RemoteWork') {
      const selectedDay = dayjs(eventDetails.date);
      // Get the Monday of the corresponding week
      const weekStartDay = selectedDay.startOf('week').subtract(1, 'day');
      const monday = weekStartDay.toDate();
      // Get the Friday of the week by adding 6 days to the Monday
      const weekEndDay = weekStartDay.add(6, 'day');
      const friday = weekEndDay.toDate();
      const countOptions: FindManyOptions<Events> = {
        where: {
          userId: userId,
          eventType: 'RemoteWork',
          date: Between(monday, friday),
        },
      };
      const remoteWorkCountThisWeek = await this.eventsRepository.count(countOptions);
      if (remoteWorkCountThisWeek >= 2) {
        throw new UnauthorizedException(
          'You cannot have more than two remote work events per week',
        );
      }
    }
    // Rule: Remote work events do not require approval from a supervisor
    if (eventDetails.eventType === 'RemoteWork') {
      eventDetails.eventStatus == 'Accepted';
    }
    // Rule: If an Employee tries to create a Paid Leave event, its status is set to Pending
    if (eventDetails.eventType === 'PaidLeave') {
      eventDetails.eventStatus == 'Pending';
    }
    // Create the event
    const newEvent = this.eventsRepository.create({
      ...eventDetails,
      userId: userId,
    });
    // Save the event in the database
    const savedEvent = await this.eventsRepository.save(newEvent);
    return savedEvent;
  }
  

  async findById(eventId: string): Promise<Events> {
    const event = await this.eventsRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }

  async findAll(): Promise<Events[]> {
    return await this.eventsRepository.find();
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

    return await this.eventsRepository.count({
      where: {
        userId: userId,
        date: Between(startOfMonth, endOfMonth),
        eventStatus: EventStatus.Accepted,
      },
    });
  }

  // Private helper methods
  async validateRemoteWorkLimit(userId: string, date: Date): Promise<void> {
    const weekStart = dayjs(date).startOf('week').toDate();
    const weekEnd = dayjs(date).endOf('week').toDate();

    const count = await this.eventsRepository.count({
      where: {
        userId: userId,
        eventType: EventType.RemoteWork,
        date: Between(weekStart, weekEnd),
      },
    });

    if (count >= 2) {
      throw new UnauthorizedException('Remote work limit reached for the week');
    }
  }

  async updateEventStatus(eventId: string, status: EventStatus): Promise<void> {
    await this.eventsRepository.update(eventId, { eventStatus: status });
  }
  
}
