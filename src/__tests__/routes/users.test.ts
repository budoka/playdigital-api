import jwt, { TokenExpiredError } from 'jsonwebtoken';
import 'reflect-metadata';
import { UnauthorizedError } from 'routing-controllers';
import Currency from 'src/models/entities/currency.entity';
import { getVar } from 'src/utils/enviroment';
import request from 'supertest';
import { getConnectionManager } from 'typeorm';
import { app } from '../../../jest.setup';
import { getRandomInteger } from 'src/utils/number';

const application = app.app;

describe('/api', () => {
  describe('/users', () => {
    test(`GET / | 200`, async (done) => {
      await app.start(false);
      request(application).get('/api/users').expect(200).expect('Content-Type', /json/).end(done);
    });

    test(`GET /login | 200`, async (done) => {
      await app.start(false);
      request(application)
        .post('/api/users/login')
        .send({ username: 'user12345', password: 'user12345' })
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          const token = res.body.token;
          const key = getVar('JWT_SECRET_KEY');
          const options = {
            issuer: getVar('JWT_ISSUER'),
          };
          try {
            jwt.verify(token, key, options);
          } catch (error) {
            let message;
            if (error instanceof TokenExpiredError) message = 'Token expired.';
            else message = 'Invalid token.';
            throw new UnauthorizedError(message);
          }
        })
        .end(done);
    });

    test(`POST / | 200`, async (done) => {
      const database = getVar('DATABASE_NAME');
      const repository = getConnectionManager().get(database).getRepository(Currency);
      const user = {
        firstname: 'Facundo',
        lastname: 'Vazquez',
        username: `randomUser${getRandomInteger(1, 10000)}`,
        password: `randomPassword`,
        currencyId: await repository.findOne({ symbol: 'ARS' }).then((currency) => currency?.id),
      };

      await app.start(false);
      request(application)
        .post('/api/users')
        .send(user)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done);
    });
  });
});
