import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from '../auth/jwt.stategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({ 
      imports:[ ConfigModule],
      inject: [ ConfigService ],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>("JWT_EXPIRES"),
          },
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersService, JwtStrategy],
  controllers: [UsersController],
  exports: [JwtStrategy, PassportModule]
})
export class UserModule {}