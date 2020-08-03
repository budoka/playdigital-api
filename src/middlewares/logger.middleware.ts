import express from 'express';
import { Middleware, ExpressMiddlewareInterface } from 'routing-controllers';
import logger, { Levels } from 'src/logger';

@Middleware({ type: 'after' })
export class LoggerMiddleware implements ExpressMiddlewareInterface {
  use(req: express.Request, res: express.Response, next: Function) {
    logger.log({
      level: Levels.Debug,
      message: `${req.method} ${req.path} from ${req.ip} | Response: ${res.statusCode} - ${res.statusMessage}`,
    });
    next();
  }
}
