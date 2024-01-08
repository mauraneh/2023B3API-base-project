import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { NestFactory } from '@nestjs/core';

import { DayOneTesting } from './days/day1.testing';
import { DayTwoPartOneTesting } from './days/day2-part1.testing';
import { DayTwoPartTwoTesting } from './days/day2-part2.testing';
import { DayThreeTesting } from './days/day3.testing';
import { DayFourTesting } from './days/day4.testing';
import { DayFivePartOneTesting } from './days/day5-part1.testing';
import { DayFivePartTwoTesting } from './days/day5-part2.testing';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(AppModule, { cors: true });
    await app.listen(3001);

    pactum.request.setBaseUrl('http://localhost:3001');
  });

  afterAll(async () => {
    await app.close();
  });

  new DayOneTesting(app).routeTest();
  new DayTwoPartOneTesting(app).routeTest();
  new DayTwoPartTwoTesting(app).routeTest();
  new DayThreeTesting(app).routeTest();
  new DayFourTesting(app).routeTest();
  new DayFivePartOneTesting(app).routeTest();
  new DayFivePartTwoTesting(app).routeTest();
});
