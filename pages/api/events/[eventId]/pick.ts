import { DateTimeRange } from '../../../../models/DateTimeRange';
import getMongo from '../../../../utils/getMongo';
import verifyToken from '../../../../utils/verifyToken';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import jsonwebtoken from 'jsonwebtoken';

const pick: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      return handleCreatePick(req, res);
    case 'GET':
      return handleGetPicks(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: 'ERROR_METHOD_NOT_ALLOWED' });
  }
};

async function handleGetPicks(req: NextApiRequest, res: NextApiResponse) {
  verifyToken(req.headers.authorization?.split(' ')[1],
    req.query.eventId as string);
  const mongo = await getMongo();
  const picks = await mongo.collection('picks').aggregate([
    { $match: { eventId: req.query.eventId } },
    {
      $group: {
        _id: '$userName',
        value: { $last: '$value' },
        createdAt: { $last: '$createdAt' }
      }
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        picks: '$value',
      }
    }
  ]).toArray();
  res.status(200).json(picks);
}

async function handleCreatePick(req: NextApiRequest, res: NextApiResponse) {

  const { eventId } = req.query;

  const value: string[] = req.body.value;
  const parsedValue: DateTimeRange[] = value.map(
    v => DateTimeRange().fromString(v));

  if (parsedValue.length === 0) {
    res.status(400).json({ error: 'ERROR_NO_VALUE_SELECTED' });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ error: 'JWT_SECRET is not set' });
    return;
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'ERROR_NOT_LOGGED_IN' });
    return;
  }

  const parsedToken = jsonwebtoken.verify(token,
    process.env.JWT_SECRET) as unknown as { sub: string, eventId: string };

  if (!parsedToken) {
    res.status(401).json({ error: 'ERROR_NOT_LOGGED_IN' });
    return;
  }

  if (parsedToken.eventId !== req.query.eventId) {
    res.status(401).json({ error: 'ERROR_NOT_LOGGED_IN' });
    return;
  }

  const mongo = await getMongo();
  const findEvent = await mongo.collection('events')
    .findOne({ nanoid: eventId });
  if (!findEvent) {
    res.status(404).json({ error: 'ERROR_EVENT_NOT_FOUND' });
    return;
  }

  const findUser = await mongo.collection('users').findOne({
    eventId,
    name: parsedToken.sub
  });

  if (!findUser) {
    res.status(404).json({ error: 'ERROR_USER_NOT_FOUND' });
    return;
  }

  const insert = await mongo.collection('picks').insertOne({
    eventId,
    userName: parsedToken.sub,
    value,
    createdAt: new Date()
  });

  const findPick = await mongo.collection('picks').findOne({
    _id: insert.insertedId,
    eventId,
  });

  if (!findPick) {
    res.status(500).json({ error: 'ERROR_INSERT_PICK' });
    return;
  }

  res.status(201).json({ ...findPick });
}

export default pick;
