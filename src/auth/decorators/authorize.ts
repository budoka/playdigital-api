import express from 'express';
import { verifyJWT } from 'src/auth';

/**
 * Realize a verification of JSON Web Token (JWT).
 */
export function Authorize() {
  return function (target: Object, fnName: string, propertyDescriptor: PropertyDescriptor) {
    const fn = propertyDescriptor.value;

    propertyDescriptor.value = function (req: express.Request, res: express.Response, ...args: any) {
      verifyJWT(req, res);
      return fn.apply(this, [req, res, ...args]);
    };
  };
}
