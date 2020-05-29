import { IAuthentication } from '../../../middleware/authentication';
import { IResult, IClient } from '../../../burst/burst';
import DBAccessor from '../../../db';
import Environment from '../../../environment';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ILoginData from './abstract/login-data';
import gen from '../../../helpers/id-gen';


export default async function (login: ILoginData, client: IClient): Promise<IResult> {
  if (!!client.authentication) {
    return {
      status: 405,
      event: 'log',
      auth: client.authentication ? client.authentication._id : false
    };
  }

  const user: any = (
    await DBAccessor.db()
      .collection('private')
      .find({
        email: login.email,
      })
      .toArray()
  )[0];

  const password: string = user?.password || '';
  const _id: string = user?._id || '';

  const match: boolean = await bcrypt.compare(login.password, password);

  if (!match) {
    return {
      status: 201,
      event: 'log-in__failure',
      auth: !!client.authentication,
    };
  }

  const token = jwt.sign(
    {
      _id,
      time: Math.random(),
    },
    Environment.secretKey,
    {
      expiresIn: '1h',
    }
  );

  const session = gen({
    length: 26,
  });

  await DBAccessor.db().collection('sessions').insertOne({
    _id: session,
    userId: _id,
  });

  return {
    status: 201,
    event: 'log-in__success',
    data: { _id, token, session },
    auth: client.authentication,
    // cookies: [
    //   {
    //     name: 'session',
    //     value: session,
    //     expires: 720,
    //   },
    //   {
    //     name: 'token',
    //     value: token,
    //     expires: 1,
    //   },
    // ],
  };
}
