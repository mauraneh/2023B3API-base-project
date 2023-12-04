import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from '../auth/jwt.stategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constant';
import Project from '../project/entities/project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project]),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({ 
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt'}),
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [JwtModule, PassportModule]
})
export class UserModule {}