import { Module } from '@nestjs/common';
import { ProjectUserService } from './project-user.service';
import { ProjectUserController } from './project-user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Project from '../project/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { ProjectUser } from './entities/project-user.entity';
import { UserModule } from '../users/users.module';
import { UsersController } from '../users/users.controller';
import { ProjectController } from '../project/projects.controller';
import { UsersService } from '../users/users.service';
import { ProjectService } from '../project/projects.service';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([ProjectUser, Project, User]),
    UserModule
  ],
  controllers: [
    ProjectUserController, UsersController, ProjectController],
  providers: [
    ProjectUserService, UsersService, ProjectService],
  exports: [
    ProjectUserService, ProjectService],
})
export class ProjectUserModule {}
