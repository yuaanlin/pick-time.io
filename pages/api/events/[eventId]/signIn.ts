import { NextApiHandler } from 'next';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import RedisClient from '@utils/getRedis';

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
  if (!eventId || typeof eventId !== 'string') {
    res.status(404).json({ error: 'NOT_FOUND' });
    return;
  }

  const redis = new RedisClient();
  const find = await redis.getUser(eventId, name) as any;
  if (!find) {
    const insertData: any = {
      name,
      eventId
    };
    if (password.length > 0) {
      insertData.passwordHash = bcrypt.hashSync(password, 10);
    }
    await redis.setUser(eventId, insertData.name, insertData.passwordHash);
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
