import { Module } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { ProjectController } from './projects.controller';
import { UsersService } from '../users/users.service';
import { ProjectUserService } from '../project-user/project-user.service';
import { UsersController } from '../users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import Project from './entities/project.entity';
import { UserModule } from '../users/users.module';
import { ProjectUser } from '../project-user/entities/project-user.entity';
import { ProjectUserController } from '../project-user/project-user.controller';

@Module({
  imports: [ TypeOrmModule.forFeature([Project, User, ProjectUser]), 
  UserModule,
],
  controllers: [ProjectController, UsersController, ProjectUserController],
  providers: [ProjectService, UsersService, ProjectUserService],
  exports: [ProjectService, UsersService, ProjectUserService],
})
export class ProjectModule {}
