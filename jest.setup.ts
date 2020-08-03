import 'reflect-metadata';
import express from 'express';
import { OpenAPIObject } from 'openapi3-ts';
import { App } from './src/app';
import logger from './src/logger';
import { getVar } from './src/utils/enviroment';

// Disabled logger
logger.transports.forEach((t) => (t.silent = true));

require('mysql2/node_modules/iconv-lite').encodingExists('foo');
// jest.setTimeout(30000);

// Init APP

const application = express();
const hostname = 'localhost' || '192.168.0.49';
const port = Number(getVar('PORT')) || 3009;

// API Info
const specs: Partial<OpenAPIObject> = {
  openapi: '3.0.3',
  info: {
    title: 'Play Digital API',
    version: '1.0.0',
    contact: { name: 'Facundo Vázquez', email: 'facundoxvazquez@gmail.com' },
    license: { name: 'MIT' },
  },
  servers: [{ url: `http://${hostname}:${port}/api/` }],
  externalDocs: { description: 'Swagger JSON', url: `http://${hostname}:${port}/swagger` },
};

const app = new App(application, port, specs);

export { app };
