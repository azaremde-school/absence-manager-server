import { Request } from 'express';
import { authentication, IAuthentication } from '../middleware/authentication';
import { Response } from 'express';

interface ICookie {
  name: string;
  value?: string;
  expires?: number;
}

interface IResult {
  status: number;
  auth: string | false;
  event?: string;
  data?: any;
  cookies?: ICookie[];
}

enum EClientType {
  Browser,
  App
}

interface IClient {
  authentication: IAuthentication | false;
  clientType: EClientType;
}

type TCallback = (data: any, authenticated: IClient) => Promise<IResult>;

interface IHandlers {
  [key: string]: TCallback;
}

interface IBurstParams {
  handlers: { [key: string]: TCallback };
  log?: boolean;
}

class Burst {
  private static log: boolean;

  private static endMeasure(time: number, display: string): void {
    var msg: string = display || '';
    for (var i = msg.length; msg.length < 35; i++) {
      msg += ' ';
    }
    msg += `${time} ms`;
    console.log(msg);
  }

  public static async handle(request: Request): Promise<IResult> {
    var time = 0;

    if (Burst.log) {
      time = Date.now();
    }

    const callback = Burst.handlers[request.body.event];
    const clientType: EClientType = (<any> request)['clientType'];
    const authenticated: IAuthentication | false = await authentication(request, clientType);

    const client: IClient = {
      authentication: authenticated,
      clientType
    }

    if (callback) {
      const result: IResult = await callback(request.body.data, client);

      if (Burst.log) {
        const computationTime = Date.now() - time;

        Burst.endMeasure(computationTime, request.body.event);
      }

      return result;
    } else {
      if (Burst.log) {
        const computationTime = Date.now() - time;

        Burst.endMeasure(computationTime, request.body.event);
      }

      return {
        status: 404,
        event: 'log',
        data: {
          msg: `[${request.body.event}]: It seems like the event you are calling does not exist.`,
        },
        auth: false,
      };
    }
  }

  public static defineCookies(response: Response, result: IResult) {
    if (result.cookies) {
      for (var i = 0; i < result.cookies.length; i++) {
        const name: string = result.cookies[i].name;
        const value: string | undefined = result.cookies[i].value;
        const expires: number = (result.cookies[i].expires || 0) * 1000 * 60 * 60;
  
        if (value) {
          response.cookie(name, value, { maxAge: expires, httpOnly: true });
        } else {
          response.clearCookie(name);
        }
      }
    }
  }

  private static handlers: {
    [key: string]: TCallback
  }

  public static init(params: IBurstParams): void {
    Burst.handlers = params.handlers;
    Burst.log = params.log || false;
  }
}

export default Burst;
export { IResult, IHandlers, IClient, EClientType };
