import getMongo from '../../../../utils/getMongo';
import { NextApiHandler } from 'next';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

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
  const mongo = getMongo();
  const find = await mongo.collection('users').findOne({
    name,
    eventId
  });
  if (!find) {
    const insertData: any = {
      name,
      eventId
    };
    if (password.length > 0) {
      insertData.passwordHash = bcrypt.hashSync(password, 10);
    }
    const insert = await mongo.collection('users').insertOne(insertData);
    const user = await mongo.collection('users')
      .findOne({ _id: insert.insertedId }, { projection: { passwordHash: 0 } });
    if (!user) {
      res.status(500).json({ error: 'Failed to create user' });
      return;
    }
    const token = jsonwebtoken.sign({
      iat: Date.now(),
      sub: user.name,
      eventId
    }, process.env.JWT_SECRET);
    res.status(201).json({
      user,
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
