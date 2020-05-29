import ILessons from './lessons';

export default interface IAbsence {
  date: string;
  lessons: ILessons[];
}
