import { DateTimeRange } from '@models/DateTimeRange';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import jsonwebtoken from 'jsonwebtoken';
import RedisClient from '@utils/getRedis';
import { ErrorCode } from '@models/errors';

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
  const { eventId } = req.query;
  if (!eventId || typeof eventId !== 'string') {
    res.status(404).json({ error: 'NOT_FOUND' });
    return;
  }
  const redis = new RedisClient();
  const picks = await redis.getPicks(eventId) || [];
  res.status(200).json(picks);
}

async function handleCreatePick(req: NextApiRequest, res: NextApiResponse) {

  const { eventId } = req.query;
  if (!eventId || typeof eventId !== 'string') {
    res.status(404).json({ error: 'NOT_FOUND' });
    return;
  }

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
    res.status(401).json({ error: ErrorCode.UNAUTHORIZED });
    return;
  }

  const parsedToken = jsonwebtoken.verify(token,
    process.env.JWT_SECRET) as unknown as { sub: string, eventId: string };

  if (!parsedToken) {
    res.status(401).json({ error: ErrorCode.UNAUTHORIZED });
    return;
  }

  if (parsedToken.eventId !== req.query.eventId) {
    res.status(401).json({ error: ErrorCode.UNAUTHORIZED });
    return;
  }

  const redis = new RedisClient();
  const findEvent = await redis.getEvent(eventId);
  if (!findEvent) {
    res.status(404).json({ error: ErrorCode.EVENT_NOT_FOUND });
    return;
  }

  const findUser = await redis.getUser(eventId, parsedToken.sub);
  if (!findUser) {
    res.status(401).json({ error: ErrorCode.UNAUTHORIZED });
    return;
  }

  let picks = await redis.getPicks(eventId) || [];
  picks = picks.filter(p => p.name !== parsedToken.sub);
  picks.push({
    name: parsedToken.sub,
    picks: value
  });
  await redis.setPicks(eventId, picks);

  res.status(201).json({ ok: true });
}

export default pick;
