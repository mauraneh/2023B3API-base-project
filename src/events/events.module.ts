import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { ProjectUsersService } from '../project-users/project-users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUsersController } from '../project-users/project-users.controller';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/users.controller';
import { UsersModule } from '../users/users.module';
import { Users } from '../users/entities/users.entity';
import { ProjectUsers } from '../project-users/entities/project-users.entity';
import Projects from '../projects/entities/projects.entity';
import { ProjectsController } from '../projects/projects.controller';
import { Events } from './entities/events.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Projects, Users, ProjectUsers, Events]),
    forwardRef(() => UsersModule),
  ],
  controllers: [
    ProjectUsersController,
    UsersController,
    ProjectsController,
    EventsController,
  ],
  providers: [
    ProjectUsersService,
    UsersService,
    ProjectsService,
    EventsService,
  ], 
  exports: [ProjectUsersService, ProjectsService, EventsService],
})
export class EventsModule {}