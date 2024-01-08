import { faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { BaseRouteTesting } from '../base-route';

export class DayOneTesting extends BaseRouteTesting {
  constructor(app: INestApplication) {
    super(app, 'users');
  }

  passwordRegex =
    '^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]){8}$';

  routeTest() {
    describe('route', () => {
      const commonUsername = faker.internet.userName();
      const commonEmail = faker.internet.email();
      const commonPassword = faker.internet.password({ length: 10 });

      beforeAll(async () => {
        await this.createAllUsers();
      });

      describe('users', () => {
        // --- /auth/sign-up
        describe('post /users/auth/sign-up', () => {
          it('should return 201 (with great schema)', async () => {
            const regexExp =
              /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
            const data = {
              email: commonEmail,
              username: commonUsername,
              password: commonPassword,
            };

            await this.customPostWithoutAccessToken('auth/sign-up')
              .withJson(data)
              .expectJsonLike({
                id: regexExp,
                email: data.email,
                username: data.username,
                role: 'Employee',
              })
              .expectStatus(201)
              .expectJsonSchema({
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                  id: {
                    type: 'string',
                  },
                  role: {
                    type: 'string',
                  },
                },
                required: ['username', 'email', 'id', 'role'],
                additionalProperties: false,
              });
          });

          it('should return 201 (create user with explicit role)', async () => {
            await this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: faker.internet.email(),
                username: faker.internet.userName(),
                password: faker.internet.password({ length: 10 }),
                role: 'ProjectManager',
              })
              .expectJsonLike({
                role: 'ProjectManager',
              })
              .expectStatus(201);
          });

          it('should return 500 for duplicate key (email)', (): any => {
            return this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: commonEmail,
                username: faker.internet.userName(),
                password: faker.internet.password({ length: 10 }),
              })
              .expectStatus(500);
          });

          it('should return 500 for duplicate key (username)', (): any => {
            return this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: faker.internet.email(),
                username: commonUsername,
                password: faker.internet.password({ length: 10 }),
              })
              .expectStatus(500);
          });

          it('should return 400 for email not correct', (): any => {
            return this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: 'test@test',
                username: faker.internet.userName(),
                password: faker.internet.password({ length: 10 }),
              })
              .expectStatus(400)
              .expectBodyContains('email must be an email');
          });

          it('should return 400 because username is mandatory', (): any => {
            return this.customPostWithoutAccessToken('auth/sign-up')
              .withJson({
                email: faker.internet.email(),
                password: faker.internet.password({ length: 10 }),
              })
              .expectStatus(400)
              .expectBodyContains('username should not be empty');
          });
        });

        // --- /auth/login
        describe('post /users/auth/login', () => {
          it('should return 201', (): any => {
            return this.customPostWithoutAccessToken('auth/login')
              .withJson({
                email: commonEmail,
                password: commonPassword,
              })
              .expectStatus(201)
              .expectBodyContains('access_token');
          });

          it('should return 401 wrong password', (): any => {
            return this.customPostWithoutAccessToken('auth/login')
              .withJson({
                email: commonEmail,
                password: faker.internet.password({ length: 10 }),
              })
              .expectStatus(401);
          });
        });

        // --- /me
        describe('get /users/me', () => {
          it('should return 401', (): any => {
            return this.customGetWithoutAccessToken('me').expectStatus(401);
          });

          this.itu('should return 200', async () => {
            return this.customGet('me')
              .expectStatus(200)
              .expectJsonSchema({
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                  },
                  username: {
                    type: 'string',
                  },
                  email: {
                    type: 'string',
                  },
                  role: {
                    type: 'string',
                  },
                },
                required: ['username', 'email', 'id', 'role'],
                additionalProperties: false,
              })
              .expectBodyContains(this.user.email);
          });
        });
      });
    });
  }
}
