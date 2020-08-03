import express from 'express';
import { ExpressMiddlewareInterface, Middleware, NotFoundError } from 'routing-controllers';

@Middleware({ type: 'after' })
export class NotFoundMiddleware implements ExpressMiddlewareInterface {
  use(req: express.Request, res: express.Response, next: Function) {
    if (!res.headersSent) {
      let message;
      if (req.originalUrl && req.originalUrl.match(/^\/api\/.+/)) message = 'Endpoint not found.';
      else message = 'Resource not found.';
      return res.status(404).send(new NotFoundError(message));
    }
    next();
  }
}
