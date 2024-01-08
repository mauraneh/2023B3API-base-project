import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Req,
  UseGuards,
  Get,
  Param,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventsDto } from './dto/create-events.dto';
import { AuthGuard } from '../auth/auth.guard';
import { ProjectUsersService } from '../project-users/project-users.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly projectUsersService: ProjectUsersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() dto: CreateEventsDto, @Req() req) {
    const userId = req.user.sub;
    return this.eventsService.createNewEvent(userId, dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  get(@Param('id') eventId: string) {
    return this.eventsService.findById(eventId);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll() {
    return this.eventsService.findAll();
  }

  @Post('/:id/validate')
  @UseGuards(AuthGuard)
  async validate(@Param('id') eventId: string, @Req() req) {
    
    this.checkUserRole(req.user.role, eventId);
    return this.eventsService.approve(eventId);
  }

  @Post('/:id/decline')
  @UseGuards(AuthGuard)
  async decline(@Param('id') eventId: string, @Req() req) {
    this.checkUserRole(req.user.role, eventId);
    return this.eventsService.reject(eventId);
  }

  private async checkUserRole(role: string, eventId: string) {
    if (role === 'Employee') {
      throw new UnauthorizedException('Unauthorized access');
    }

    const event = await this.eventsService.findById(eventId);
    if (event.eventStatus !== 'Pending') {
      throw new HttpException('Event status cannot be altered', HttpStatus.FORBIDDEN);
    }

    if (role === 'ProjectManager') {
      const isAuthorized = await this.projectUsersService.managerDate(role, event.date);
      if (!isAuthorized) {
        throw new HttpException('Unauthorized access', HttpStatus.UNAUTHORIZED);
      }
    }
  }
}
