import express from 'express';
import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from 'routing-controllers';
import { CrashableError, EnviromentError } from 'src/exceptions';
import logger, { Levels } from 'src/logger';
import { isProduction } from 'src/utils/enviroment';

@Middleware({ type: 'after' })
export class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: EnviromentError | Error, req: express.Request, res: express.Response, next: Function) {
    logger.log({ level: Levels.Error, message: JSON.stringify(error, undefined, 2) });

    let json: HttpError = {
      name: error.name,
      httpCode: (error as HttpError).httpCode || 500,
      message: error.message,
      stack: isProduction() ? undefined : error.stack,
    };

    res.status(json.httpCode).json(json);

    if (error instanceof CrashableError) process.exit(1);

    next();
  }
}
