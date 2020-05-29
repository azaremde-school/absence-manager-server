import { config } from 'dotenv'

class Environment {
  public static production: boolean;
  public static log: boolean;

  public static port: number;
  public static host: string;

  public static secretKey: string;

  public static mongodbUser: string;
  public static mongodbPassword: string;

  public static allowedDomainsCount: number;
  public static allowedDomains: string[];

  public static appKey: string;

  public static display(): void {
    console.log('<------------Config------------>');
    console.log(`Production: ${Environment.production}`);
    console.log(`Log: ${Environment.log}`);
    console.log(`Port: ${Environment.port}`);
    console.log(`Host: ${Environment.host}`);
    console.log(`Secret key: ${Environment.secretKey}`);
    console.log(`MongoDB username: ${Environment.mongodbUser}`);
    console.log(`MongoDB password: ${Environment.mongodbPassword}`);
    console.log(`Allowed domains count: ${Environment.allowedDomainsCount}`);
    console.log(`Allowed domains: ${Environment.allowedDomains}`);
    console.log(`App key: ${Environment.appKey}`);
    console.log('<------------Config-----------/>');
  }

  public static init(): void {
    config({ path: '.env' });
    
    Environment.production = process.env.PRODUCTION === 'true';
    Environment.log = process.env.LOG === 'true';

    Environment.port = <number> (process.env.PORT || 3000);
    Environment.host = <string> (process.env.HOST || 'localhost');

    Environment.secretKey = <string> (process.env.SECRET_KEY || '');

    Environment.mongodbUser = <string> (process.env.MONGODB_USER || '');
    Environment.mongodbPassword = <string> (process.env.MONGODB_PASSWORD || '');

    Environment.allowedDomainsCount = <number> (process.env.ALLOWED_DOMAINS_COUNT || 0);
    Environment.allowedDomains = [];

    for (var i = 0; i < Environment.allowedDomainsCount; i++) {
      Environment.allowedDomains.push(<string> process.env[`ALLOWED_DOMAIN_${i}`]);
    }

    Environment.appKey = <string> (process.env.APP_KEY || '');
  }
}

Environment.init();

export = Environment;