import { MongoClient, Db } from 'mongodb';
import Environment from './environment';

class DBAccessor {
  public static client: MongoClient;

  public static db(): Db {
    return DBAccessor.client.db('social-network');
  }

  public static init(): void {
    const uri = `mongodb+srv://${Environment.mongodbUser}:${Environment.mongodbPassword}@social-network-u1s7h.mongodb.net/test?retryWrites=true&w=majority`;

    DBAccessor.client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 100 });
    DBAccessor.client.connect();
  }
}

export = DBAccessor;
