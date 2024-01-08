import { Module } from '@nestjs/common';
import { ProjectUsersService } from './project-users.service';
import { ProjectUsersController } from './project-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Projects from '../projects/entities/projects.entity';
import { Users } from '../users/entities/users.entity';
import { ProjectUsers } from './entities/project-users.entity';
import { UsersModule } from '../users/users.module';
import { UsersController } from '../users/users.controller';
import { ProjectsController } from '../projects/projects.controller';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';
import { Events } from '../events/entities/events.entity';
import { EventsService } from '../events/events.service';
import { EventsController } from '../events/events.controller';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ProjectUsers, Projects, Users, Events]),
    UsersModule
  ],
  controllers: [
    ProjectUsersController, UsersController, ProjectsController, EventsController],
  providers: [
    ProjectUsersService, UsersService, ProjectsService, EventsService],
  exports: [
    ProjectUsersService, ProjectsService, EventsService],
})
export class ProjectUsersModule {}
