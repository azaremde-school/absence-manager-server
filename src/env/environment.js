import { config } from 'dotenv';

class Environment {
  static display() {
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

  static init() {
    config({ path: '.env' });

    Environment.production = process.env.PRODUCTION === 'true';
    Environment.log = process.env.LOG === 'true';

    Environment.port = process.env.PORT || 3000;
    Environment.host = process.env.HOST || 'localhost';

    Environment.secretKey = process.env.SECRET_KEY || '';

    Environment.mongodbUser = process.env.MONGODB_USER || '';
    Environment.mongodbPassword = process.env.MONGODB_PASSWORD || '';

    Environment.allowedDomainsCount = process.env.ALLOWED_DOMAINS_COUNT || 0;
    Environment.allowedDomains = [];

    for (var i = 0; i < Environment.allowedDomainsCount; i++) {
      Environment.allowedDomains.push(process.env[`ALLOWED_DOMAIN_${i}`]);
    }

    Environment.appKey = process.env.APP_KEY || '';
  }
}

Environment.init();

export default Environment;
