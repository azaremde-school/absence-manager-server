import Environment from '@/env/Environment';
import { Router } from 'express';
import DBAccessor from '@/core/db-accessor';
import generateId from '@/util/generate-id';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = (
    await DBAccessor.db()
      .collection('private')
      .find({
        email,
      })
      .toArray()
  )[0];

  if (!user) {
    req.status(202).json({
      result: 'ERROR',
    });
  }

  const equal = await bcrypt.compare(password, user.password);
  
  const token = equal
    ? jwt.sign({
      _id: user._id
    }, Environment.secretKey)
    : false;

  const result = equal ? 'SUCCESS' : 'ERROR';

  res.status(200).json({
    result,
    token
  });
});

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const _id = generateId({
    length: 22,
  });

  const userExists = (
    await DBAccessor.db()
      .collection('private')
      .find({
        email,
      })
      .toArray()
  )[0];

  const salt = await bcrypt.genSalt(10);

  const encryptedPassword = await bcrypt.hash(password, salt);

  if (userExists) {
    res.status(202).json({
      result: 'EXISTS',
    });

    return;
  }

  await DBAccessor.db().collection('private').insertOne({
    _id,
    email,
    password: encryptedPassword,
  });

  await DBAccessor.db().collection('public').insertOne({
    _id,
    firstName,
    lastName,
  });

  res.status(200).json({
    result: 'SUCCESS',
  });
});

router.get('/check_auth', async (req, res) => {
  const { token } = req.query;

  try {
    const result = jwt.verify(token, Environment.secretKey);
  
    res.status(200).json(result)
  } catch (e) {  
    res.status(200).json();
  }
});

export default router;
