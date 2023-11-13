import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUserModule } from './project-user/project-user.module';
import { ProjectModule } from './project/project.module';
import { EventModule } from './event/event.module';
import { UserModule } from './users/users.module';
import { User } from './users/entities/user.entity';


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
          User
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
