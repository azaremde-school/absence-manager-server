import express from 'express';

import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import burst from './api/main';

import cookieParser from 'cookie-parser';
import definePlatform from './middleware/define-platform';
import checkCors from './middleware/check-cors';

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));

app.use(definePlatform);
app.use(checkCors);
app.use('/burst', burst);

export = app;
