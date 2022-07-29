import { NextApiHandler } from 'next';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import getRedis from '@utils/getRedis';

const signIn: NextApiHandler = async (req, res) => {
  const {
    name,
    password
  } = req.body;

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ error: 'JWT_SECRET is not set' });
    return;
  }

  const { eventId } = req.query;
  const redis = await getRedis();
  const find = await redis.get(`events:${eventId}:users:${name}`) as any;
  if (!find) {
    const insertData: any = {
      name,
      eventId
    };
    if (password.length > 0) {
      insertData.passwordHash = bcrypt.hashSync(password, 10);
    }
    await redis.set(`events:${eventId}:users:${name}`, insertData);
    const token = jsonwebtoken.sign({
      iat: Date.now(),
      sub: name,
      eventId
    }, process.env.JWT_SECRET);
    res.status(201).json({
      name: insertData.name,
      token
    });
    return;
  }

  if (find.passwordHash) {
    const isValid = bcrypt.compareSync(password, find.passwordHash);
    if (!isValid) {
      res.status(400).json({ error: 'Invalid password' });
      return;
    }
  }

  const token = jsonwebtoken.sign({
    iat: Date.now(),
    sub: find.name,
    eventId
  }, process.env.JWT_SECRET);

  delete find.passwordHash;

  res.status(200).json({
    user: find,
    token
  });
};

export default signIn;
