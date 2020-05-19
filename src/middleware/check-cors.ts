import { Response, NextFunction } from 'express';
import { EClientType } from '../burst/burst';
import TMiddleware from '../abstract/middleware';
import IExtendedRequest from '../abstract/extended-request';

function checkCors(req: IExtendedRequest, res: Response, next: NextFunction) {
  if (req.clientType === EClientType.Browser) {
    res.header('Access-Control-Allow-Origin', req.origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  next();
}

export = checkCors as TMiddleware;
