import { Request } from 'express';
import { EClientType } from "../burst/burst";

interface IExtendedRequest extends Request {
  origin: string;
  clientType: EClientType;
}

export = IExtendedRequest;