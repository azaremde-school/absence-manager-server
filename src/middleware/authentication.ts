import { Request } from 'express';
import jwt from 'jsonwebtoken';
import Environment from '../environment';
import DBAccessor from '../db';
import { EClientType } from '../burst/burst';
import IVerification from '../abstract/verification';
import IAuthentication from '../abstract/authentication';

function checkToken(token: string): string | false {
  try {
    const decoded: IVerification | false = jwt.verify(token, Environment.secretKey) as IVerification | false;
    return decoded ? decoded._id : false;
  } catch (e) {
    return false;
  }
}

interface ISessionCheckResult {
  token: string;
  _id: string;
}

async function checkSession(session: string): Promise<ISessionCheckResult | false> {
  const _id = (
    await DBAccessor.db()
      .collection('sessions')
      .find({
        _id: session,
      })
      .toArray()
  )[0]?.userId;

  var result: ISessionCheckResult | false = false;

  if (_id) {
    result = {
      token: jwt.sign(
        {
          _id,
          time: Math.random(),
        },
        Environment.secretKey,
        {
          expiresIn: '1h',
        }
      ),
      _id
    }
  }

  return result;
}

async function authentication(request: Request, clientType: EClientType): Promise<IAuthentication | false> {
  // var token: string = clientType === EClientType.Browser ? request.cookies.token || '' : request.headers['token'] || '';
  // const session: string = clientType === EClientType.Browser ? request.cookies.session || '' : request.headers['session'] || '';
  var token: string = request.headers['token'] as (string | undefined) || '';
  const session: string = request.headers['session'] as (string | undefined) || '';

  if (token) {
    const _id: string | false = checkToken(token);

    if (_id) {
      return {
        token,
        session,
        _id
      };
    } else {
      const sessionCheckResult: ISessionCheckResult | false = await checkSession(session);

      if (sessionCheckResult) {
        return {
          token: sessionCheckResult.token,
          _id: sessionCheckResult._id,
          session,
        }
      }
    }
  } else if (session) {
    const sessionCheckResult: ISessionCheckResult | false = await checkSession(session);

    if (sessionCheckResult) {
      return {
        token: sessionCheckResult.token,
        _id: sessionCheckResult._id,
        session,
        update: 'token'
      }
    }
  }

  return false;
}

export { authentication, IAuthentication };
