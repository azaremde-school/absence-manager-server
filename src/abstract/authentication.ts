interface IAuthentication {
  token: string;
  session: string;
  _id: string;
  update?: 'token' | 'session' | 'all'
}

export = IAuthentication;
