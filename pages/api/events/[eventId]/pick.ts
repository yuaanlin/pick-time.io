import { DateTimeRange } from '@models/DateTimeRange';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import jsonwebtoken from 'jsonwebtoken';
import getPicks from '@services/getPicks';
import getRedis from '@utils/getRedis';
import { SerializedEventResult } from '@models/Pick';

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
  const picks = await getPicks(eventId);
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

  const redis = await getRedis();
  const findEvent = await redis.get(`events:${eventId}`);
  if (!findEvent) {
    res.status(404).json({ error: 'ERROR_EVENT_NOT_FOUND' });
    return;
  }

  const findUser = await redis.get(
    `events:${eventId}:users:${parsedToken.sub}`);
  if (!findUser) {
    res.status(404).json({ error: 'ERROR_USER_NOT_FOUND' });
    return;
  }

  let picks = await redis.get(
    `events:${eventId}:picks`) as SerializedEventResult[];
  if (picks.find(p => p.name === parsedToken.sub)) {
    picks = picks.filter(p => p.name !== parsedToken.sub);
    picks.push({
      name: parsedToken.sub,
      picks: value
    });
  }

  res.status(201).json({ ok: true });
}

export default pick;
