import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from './entities/users.entity';
import { JwtStrategy } from '../auth/jwt.stategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constant';
import Projects from '../projects/entities/projects.entity';
import { ProjectUsers } from '../project-users/entities/project-users.entity';
import { Events } from '../events/entities/events.entity';
import { EventsService } from '../events/events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Projects, ProjectUsers, Events]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({ 
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt'}),
  ],
  providers: [UsersService, JwtStrategy, EventsService],
  controllers: [UsersController],
  exports: [JwtModule, PassportModule]
})
export class UsersModule {}