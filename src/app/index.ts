import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { OpenAPIObject } from 'openapi3-ts';
import path from 'path';
import { useExpressServer } from 'routing-controllers';
import { getConnections } from 'src/database';
import { DatabaseError } from 'src/exceptions';
import logger, { Levels } from 'src/logger';
import { getEnvironment } from 'src/utils/enviroment';
import { createOpenAPISpecFile } from 'src/utils/openapi';
import swaggerUI from 'swagger-ui-express';

const openApiPath = '/doc';

export class App {
  static readonly enviroment: string = getEnvironment();

  readonly app: express.Application;
  readonly host: string;
  readonly port: number;
  readonly specs: Partial<OpenAPIObject>;

  constructor(app: express.Application, port: number, specs: Partial<OpenAPIObject>) {
    this.app = app;
    this.port = port;
    this.specs = specs;
  }

  async start(start: boolean = true) {
    await this.initDatabaseConnection().catch(() => process.exit(1));
    this.setup();
    if (start) this.listen();
  }

  private async initDatabaseConnection() {
    logger.log({ level: Levels.Debug, message: `Connecting to databases...` });

    try {
      const connections = await getConnections();

      if (!connections) throw new DatabaseError('Unable to connect to databases.');
      else if (connections.length === 0) throw new DatabaseError('There not databases connections defined.');

      connections.forEach((connection) => {
        logger.log({ level: Levels.Debug, message: `Connected to database: '${connection.name}'.` });
      });
    } catch (error) {
      logger.log({ level: Levels.Error, message: error });
    }
  }

  private setup() {
    // Register main middlewares
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Register controllers and basic setup
    useExpressServer(this.app, {
      routePrefix: '/api',
      defaultErrorHandler: false,
      validation: false,
      controllers: [path.join(__dirname, '../controllers/*.controller.ts')],
    });

    // Register OpenAPI/Swagger UI
    const openApiSpec = createOpenAPISpecFile(this.specs);
    this.app.use(openApiPath, swaggerUI.serve, swaggerUI.setup(openApiSpec));

    // Register Swagger JSON
    this.app.get('/swagger', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(openApiSpec, null, 2));
    });

    // Register other middlewares
    useExpressServer(this.app, {
      middlewares: [path.join(__dirname, '../middlewares/*.middleware.ts')],
    });
  }

  private listen() {
    this.app.listen(this.port, () => {
      logger.log({ level: Levels.Info, message: `App running at port: ${this.port}.` });
      logger.log({ level: Levels.Debug, message: `Api documentation: http://localhost:${this.port}${openApiPath}` });
      logger.log({ level: Levels.Debug, message: '\n.\n.\n.' });
    });
  }
}
