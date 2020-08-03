import express from 'express';
import { verifyJWT } from 'src/auth';

export function Authorize() {
  return function (target: Object, fnName: string, propertyDescriptor: PropertyDescriptor) {
    const fn = propertyDescriptor.value;

    propertyDescriptor.value = async function (req: express.Request, res: express.Response, ...args: any) {
      verifyJWT(req, res);
      return fn.apply(this, [req, res, ...args]);
    };
  };
}
