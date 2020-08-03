import 'reflect-metadata';
import request from 'supertest';
import { app } from '../../../jest.setup';
import { getVar } from 'src/utils/enviroment';
import { getConnectionManager } from 'typeorm';
import User from 'src/models/entities/user.entity';
import jwt from 'jsonwebtoken';

const application = app.app;

describe('/api', () => {
  describe('/cryptocurrencies', () => {
    test(`GET /assets | 200`, async (done) => {
      await app.start(false);
      request(application).get('/api/cryptocurrencies/assets').expect(200).expect('Content-Type', /json/).end(done);
    });

    test(`GET /marketcup | 200`, async (done) => {
      await app.start(false);
      request(application).get('/api/cryptocurrencies/marketcap').expect(200).expect('Content-Type', /json/).end(done);
    });

    test(`GET / | 200`, async (done) => {
      const database = getVar('DATABASE_NAME');
      const repository = getConnectionManager().get(database).getRepository(User);
      const user = await repository.findOne({ username: 'user12345' }).then((user) => user);

      if (!user) throw new Error('Unabled to complete test.');

      const payload = { id: user.id, username: user.username, currency: user.currency.symbol };

      // Retrieve data from environment
      const secretKey = getVar('JWT_SECRET_KEY');
      const issuer = getVar('JWT_ISSUER');
      const expiresIn = getVar('JWT_EXPIRE_TIME');

      const token = jwt.sign(payload, secretKey, {
        issuer,
        expiresIn,
      });

      await app.start(false);
      request(application)
        .get('/api/cryptocurrencies')
        .set('Authorization', 'Bearer ' + token)
        .query({ sortByPrice: 'DESC' })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done);
    });

    /* test(`GET /:symbol`, async (done) => {
      await app.start(false);
      request(application)
        .get('/api/cryptocurrencies/:symbol')
        .query({ symbol: 'BTC' })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(done);
    });*/
  });
  /*describe('/currencies', () => {
      test(`GET /`, async (done) => {
        await app.start(false);
        request(application)
          .get('/api/cryptocurrencies')
          .expect('Content-Type', /json/)
          .expect(200)
          .expect((res) => {
            //const currencies: Currency[] = res.body;
            //  res.text = /Swagger UI/;
          })
          .end(done);
      });

      test(`GET /assets`, async (done) => {
        await app.start(false);
        request(application)
          .get('/api/cryptocurrencies/assets')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(done);
      });

      test(`GET /marketcup`, async (done) => {
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
      });*/
});
