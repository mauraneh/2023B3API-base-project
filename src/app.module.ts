import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.stategy';
import { RequestLoggerMiddleware } from './auth/request.logger.middleware';
import { jwtConstants } from './auth/constant';
import Project from './project/entities/project.entity';
import { ProjectModule } from './project/projects.module';
import { ProjectUser } from './project-user/entities/project-user.entity';
import { ProjectUserModule } from './project-user/project-user.module';


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
          User, 
          Project,
          ProjectUser,
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
    UserModule,
    ProjectModule,
    ProjectUserModule,
  ],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer ) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('');
  }
}
