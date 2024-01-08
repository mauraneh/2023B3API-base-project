import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Users } from './users/entities/users.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.stategy';
import { RequestLoggerMiddleware } from './auth/request.logger.middleware';
import { jwtConstants } from './auth/constant';
import Projects from './projects/entities/projects.entity';
import { ProjectsModule } from './projects/projects.module';
import { ProjectUsers } from './project-users/entities/project-users.entity';
import { ProjectUsersModule } from './project-users/project-users.module';
import { EventsModule } from './events/events.module';
import { Events } from './events/entities/events.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          Users, 
          Projects,
          ProjectUsers,
          Events,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({ 
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
    ProjectsModule,
    ProjectUsersModule,
    EventsModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer ) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('');
  }
}
