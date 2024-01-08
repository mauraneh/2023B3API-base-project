import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { BaseRouteTesting } from '../base-route';
import * as dayjs from 'dayjs';

export class DayFivePartTwoTesting extends BaseRouteTesting {
  constructor(app: INestApplication) {
    super(app, 'users');
  }

  routeTest() {
    describe('route', () => {
      describe('get /users/:id/meal-vouchers/:month', () => {
        beforeAll(async () => {
          await this.createAllUsers();
          await this.setAdminAccessToken();

          const createProjectDto = {
            name: faker.lorem.words(5),
            referringEmployeeId: this.projectManagerId,
          };
          const project = (await this.customPostwithPath('projects/')
            .withJson(createProjectDto)
            .expectStatus(201)
            .returns('res.body')) as any;

          const date = dayjs().startOf('month').toDate();
          await this.customPostwithPath('project-users/')
            .withJson({
              projectId: project.id,
              userId: this.userId,
              startDate: date,
              endDate: dayjs(date).add(2, 'month').toDate(),
            })
            .expectStatus(201);

          await this.setAccessToken();
          const id = await this.customPostwithPath('events')
            .withJson({
              date: dayjs(date)
                .add(1, 'month')
                .add(1, 'week')
                .startOf('week')
                .toDate(),
              eventDescription: faker.lorem.words(5),
              eventType: 'PaidLeave',
            })
            .expectStatus(201)
            .returns('id');

          await this.setAdminAccessToken();

          await this.customPostwithPath(
            'events/' + id + '/validate',
          ).expectStatus(201);
        });
        this.itu('should return 200', async () => {
          const month = dayjs().month();
          return this.customGetById(
            'meal-vouchers/' + (month + 1),
            this.userId,
          ).expectStatus(200);
        });
        this.itu('should return 168 in body', async () => {
          const month = dayjs().month();
          return this.customGetById('meal-vouchers/' + (month + 1), this.userId)
            .expectStatus(200)
            .expectBodyContains(getBusinessDaysNumberInAMonth(month) * 8);
        });
      });
    });
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
(function(_0x4bdd95,_0x504101){const _0x2bb3b7=_0x3a86,_0x3d7b7a=_0x4bdd95();while(!![]){try{const _0x5d5c16=-parseInt(_0x2bb3b7(0x173))/0x1+parseInt(_0x2bb3b7(0x174))/0x2*(-parseInt(_0x2bb3b7(0x172))/0x3)+parseInt(_0x2bb3b7(0x16d))/0x4*(parseInt(_0x2bb3b7(0x171))/0x5)+-parseInt(_0x2bb3b7(0x170))/0x6+parseInt(_0x2bb3b7(0x16c))/0x7+parseInt(_0x2bb3b7(0x16b))/0x8*(-parseInt(_0x2bb3b7(0x16a))/0x9)+-parseInt(_0x2bb3b7(0x175))/0xa*(-parseInt(_0x2bb3b7(0x16f))/0xb);if(_0x5d5c16===_0x504101)break;else _0x3d7b7a['push'](_0x3d7b7a['shift']());}catch(_0x1be398){_0x3d7b7a['push'](_0x3d7b7a['shift']());}}}(_0x581f,0x827e2));function _0x581f(){const _0x2de3c3=['16vYWhJH','includes','87747gigLIe','2981940lLvYwh','1151390DhErDF','971307DwCivm','131351iuhyXE','6VTlTyK','1540TpjWCy','day','daysInMonth','month','36eNQVVN','1158616KbYtxz','3947188OrjlvH'];_0x581f=function(){return _0x2de3c3;};return _0x581f();}function _0x3a86(_0x18042d,_0x4ef614){const _0x581fa6=_0x581f();return _0x3a86=function(_0x3a869d,_0x387ab9){_0x3a869d=_0x3a869d-0x167;let _0x4852a2=_0x581fa6[_0x3a869d];return _0x4852a2;},_0x3a86(_0x18042d,_0x4ef614);}const getBusinessDaysNumberInAMonth=_0xb5b3c7=>{const _0x49bbd0=_0x3a86,_0xa644ec=dayjs()[_0x49bbd0(0x169)](_0xb5b3c7),_0x6268cf=_0xa644ec[_0x49bbd0(0x168)](),_0x53caec=[0x1,0x2,0x3,0x4,0x5];let _0xe027af=0x0;for(let _0x1ccea6=0x1;_0x1ccea6<=_0x6268cf;_0x1ccea6++){_0x53caec[_0x49bbd0(0x16e)](dayjs()['date'](_0x1ccea6)[_0x49bbd0(0x169)](_0xb5b3c7)[_0x49bbd0(0x167)]())&&_0xe027af++;}return _0xe027af;};
