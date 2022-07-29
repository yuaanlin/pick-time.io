import { DateValue } from '@models/date';
import { TimeRange } from '@models/time';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { customAlphabet } from 'nanoid';
import RedisClient from '@utils/getRedis';

const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case 'POST':
      return handleCreateEvent(req, res);
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ error: 'ERROR_METHOD_NOT_ALLOWED' });
  }
};

async function handleCreateEvent(req: NextApiRequest, res: NextApiResponse) {
  try {
    const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 6);
    const title: string = req.body.title;
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const d: string[] = req.body.availableDates;
    const t: string[] = req.body.availableTimes;

    const availableDate = d.map((date) => DateValue().fromString(date));
    const availableTime = t.map((time) => TimeRange().fromString(time));
    if (availableTime.length === 0 || availableDate.length === 0) {
      res.status(400).json({ error: 'Invalid request' });
      return;
    }
    const redis = new RedisClient();
    const insert = {
      title,
      nanoid: nanoid(),
      availableDates: d,
      availableTimes: t
    };
    await redis.setEvent(insert);
    res.status(201).json(insert);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid request' });
  }
}

export default handler;
