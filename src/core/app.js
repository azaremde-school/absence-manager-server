import express from 'express';

import bodyParser from 'body-parser';

import cookieParser from 'cookie-parser';

import definePlatform from '@/middleware/define-platform';
import checkCors from '@/middleware/check-cors';
import auth from '@/middleware/auth';

import account from '@/routes/account';

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(definePlatform);
app.use(checkCors);
app.use(auth);

app.use('/account', account);

app.get('/update', (req, res) => {
  res.status(200).json({
    result: 'updated'
  });
});

export default app;