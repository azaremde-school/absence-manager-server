import { Response, NextFunction } from 'express';
import Environment from '../environment';
import { EClientType } from '../burst/burst';
import TMiddleware from '../abstract/middleware';
import IExtendedRequest from '../abstract/extended-request';

function definePlatform(req: IExtendedRequest, res: Response<any>, next: NextFunction) {
  const origin: string = req.get('origin') || '';
  const appKey: string = (<string> req.headers['app-key']);

  const allowOrigin: boolean = !!origin && Environment.allowedDomains.includes(origin);
  const allowApp: boolean = !!appKey && Environment.appKey === appKey;

  if (allowOrigin) {
    req.clientType = EClientType.Browser;
    req.origin = origin;
  } else if (allowApp) {
    req.clientType = EClientType.App;
  }

  if (allowOrigin || allowApp) {
    next();
  }
}

export = definePlatform as TMiddleware;
