import { IAuthentication } from '../../../middleware/authentication';
import { IResult, IClient } from '../../../burst/burst';
import DBAccessor from '../../../db';
import Environment from '../../../environment';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import gen from '../../../helpers/id-gen';
import ISignupData from './abstract/signup-data';


export async function signUpRequest (signup: ISignupData, client: IClient): Promise<IResult> {
  if (!!client.authentication) {
    return {
      status: 405,
      event: 'log',
      auth: client.authentication ? client.authentication._id : false
    };
  }

  var _id: number = (await DBAccessor.db().collection('private').find({
    _id: 'id'
  }).toArray())[0].value += 1;
  
  await DBAccessor.db().collection('private').updateOne({
    _id: 'id'
  }, {
    $set: {
      value: _id
    }
  });

  const salt = await bcrypt.genSalt(10);

  const encryptedPassword = await bcrypt.hash(signup.password, salt);

  DBAccessor.db().collection('private').insertOne({
    _id,
    email: signup.email,
    password: encryptedPassword
  });

  DBAccessor.db().collection('public').insertOne({
    _id,
    firstName: signup.firstName,
    lastName: signup.lastName
  });

  return {
    status: 201,
    event: 'sign-up__success',
    auth: false
  };
}
