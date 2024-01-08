import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { UsersService } from '../users/users.service';
import { ProjectUsersService } from '../project-users/project-users.service';
import { UsersController } from '../users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities/users.entity';
import Projects from './entities/projects.entity';
import { UsersModule } from '../users/users.module';
import { ProjectUsers } from '../project-users/entities/project-users.entity';
import { ProjectUsersController } from '../project-users/project-users.controller';
import { Events } from '../events/entities/events.entity';
import { EventsController } from '../events/events.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [ TypeOrmModule.forFeature([Projects, Users, ProjectUsers, Events]), 
  UsersModule,
  EventsModule,
],
  controllers: [ProjectsController, UsersController, ProjectUsersController, EventsController],
  providers: [ProjectsService, UsersService, ProjectUsersService],
  exports: [ProjectsService, UsersService, ProjectUsersService],
})
export class ProjectsModule {}
