import 'reflect-metadata';
import request from 'supertest';
import { app } from '../../../jest.setup';

const application = app.app;

describe('Routes', () => {
  describe('OpenAPI', () => {
    test(`GET /swagger | 200`, async (done) => {
      await app.start(false);
      request(application).get('/swagger').expect('Content-Type', /json/).expect(200).end(done);
    });

    test(`GET /doc/ | 200`, async (done) => {
      await app.start(false);
      request(application).get('/doc').expect('Content-Type', /html/).expect(301).expect('Location', /\//).end(done);
    });
  });
});
