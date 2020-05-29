import { IResult, IClient } from '../../../burst/burst';
import DBAccessor from '../../../db';
import ISchoolClass from '../../../abstract/school-class';


export async function addClassRequest (schoolClass: ISchoolClass, client: IClient): Promise<IResult> {

  if (!client.authentication) {
    return {
      status: 405,
      auth: false
    }
  }

  DBAccessor.db().collection('classes').insertOne({
    owner: client.authentication._id,
    ...schoolClass
  });

  return {
    status: 201,
    event: 'sign-up__success',
    auth: client.authentication ? client.authentication._id : false
  };
}
