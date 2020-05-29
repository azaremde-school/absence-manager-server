import { IResult, IClient } from '../../../burst/burst';
import DBAccessor from '../../../db';
import ISchoolClass from '../../../abstract/school-class';


export async function getClassesRequest (data: undefined, client: IClient): Promise<IResult> {
  if (!client.authentication) {
    return {
      status: 405,
      auth: false
    }
  }

  const classes = (await DBAccessor.db().collection('classes').find({
    owner: client.authentication._id
  }).toArray());

  console.log(classes);

  return {
    status: 201,
    event: 'get-classes__response',
    data: classes,
    auth: client.authentication ? client.authentication._id : false
  };
}
