import express from 'express';
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { isString } from 'src/utils/string';
import { getVar } from '../utils/enviroment';
import { UnauthorizedError } from 'routing-controllers';

export function verifyJWT(req: express.Request, res?: express.Response) {
  let authorizationHeader = req.headers && req.headers['authorization'];

  if (!authorizationHeader || !isString(authorizationHeader)) throw new UnauthorizedError('Authorization header is missing.');

  const token = authorizationHeader.replace('Bearer ', '');
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
}
