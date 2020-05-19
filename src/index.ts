import Environment from './environment';
import http from 'http';
import app from './app';
import DBAccessor from './db';
import cluster from 'cluster';
import { cpus } from 'os';

if (cluster.isMaster && Environment.production) {
  console.clear();
  console.log(`Master ${process.pid} is running..`);
  Environment.display();

  for (var i = 0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker: cluster.Worker, code: number, signal: string) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const server = http.createServer(app);

  DBAccessor.init();

  server.listen(Environment.port, Environment.host, () => {
    const message = Environment.production ? `Worker ${process.pid} listening on port ${Environment.port}` : `Server started on ${Environment.host}:${Environment.port}`;

    if (!Environment.production) {
      console.clear();
    }

    console.log(message);

    if (!Environment.production) {
      Environment.display();
    }
  });
}
