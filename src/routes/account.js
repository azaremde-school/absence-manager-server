import Environment from '@/env/Environment';
import DBAccessor from '@/core/db-accessor';
import generateId from '@/util/generate-id';

import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { SUCCESS, ERROR, EXISTS } from '@/common/query-result';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  /**
   * Finding the user with this email in the database.
   */
  const user = (
    await DBAccessor.db()
      .collection('private')
      .find({
        email,
      })
      .toArray()
  )[0];

  /**
   * If user is not found, firing an error.
   */
  if (!user) {
    res.status(202).json({
      result: 'ERROR',
    });

    return;
  }

  /**
   * Comparing the encrypted password and the decrypted one.
   * bcrypt.
   */
  const equal = await bcrypt.compare(password, user.password);
  
  /**
   * Generating token with this user's id.
   * Expires in one day.
   * 
   * token: string | false
   */
  const token = 
    equal

      ? jwt.sign({
        _id: user._id
      }, Environment.secretKey, { expiresIn: '24h' })

      : false;

  const result = equal ? SUCCESS : ERROR;

  res.status(200).json({
    result,
    token
  });
});

router.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  /**
   * Checking if the user exists.
   * If so, not continuing, sending back an error.
   */
  const userExists = (
    await DBAccessor.db()
      .collection('private')
      .find({
        email,
      })
      .toArray()
  )[0];

  if (userExists) {
    res.status(202).json({
      result: EXISTS,
    });

    return;
  }

  /**
   * Generating an id for the new user.
   */
  const _id = generateId({
    length: 22,
  });

  /**
   * Encrypting the user's password to prepare it to be stored in the database.
   */
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  /**
   * Creating two items. The first one for 
   * storing the private data, and the second
   * one for storing the public data. 
   * 
   * With the same _id ofc.
   */
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
    result: SUCCESS,
  });
});

/**
 * Simply checking if the user's token is
 * present and still valid.
 */
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
