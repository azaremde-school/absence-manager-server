import express, { Response, NextFunction } from 'express';
import Burst, { IResult, EClientType } from '../burst/burst';

import Environment from '../environment';
import IExtendedRequest from '../abstract/extended-request';

import logIn__request from './modules/account/log-in__request';

const router = express.Router();

Burst.init({
  handlers: {
    'log-in__request': logIn__request,
  },
  log: Environment.log,
});

router.post('/', <any> async function(request: IExtendedRequest, response: Response, next: NextFunction) {
  const result: IResult = await Burst.handle(request);

  var jsonResponse: object = {
    event: result.event,
    data: result.data,
    auth: result.auth
  }

  if (request.clientType === EClientType.Browser) {
    Burst.defineCookies(response, result);
  } else {
    jsonResponse = {
      ...jsonResponse,
      cookies: result.cookies
    }
  }

  response.status(result.status).json(jsonResponse);

  next();
});

export = router;
