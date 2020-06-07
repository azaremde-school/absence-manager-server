import Environment from '@/env/environment';
import jwt from 'jsonwebtoken';

function checkToken(token) {
  try {
    const decoded = jwt.verify(token, Environment.secretKey);
    return decoded ? decoded._id : false;
  } catch (e) {
    return false;
  }
}

function auth(req, res, next) {  
  const token = req.headers['token'];

  const _id = checkToken(token);

  req.auth = _id;

  next();
}

export default auth;
