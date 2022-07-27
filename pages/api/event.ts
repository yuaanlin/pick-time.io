import getMongo from '@utils/getMongo';
import { DateValue } from '@models/date';
import { TimeRange } from '@models/time';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { customAlphabet } from 'nanoid';

const handler: NextApiHandler = (req, res) => {
  switch (req.method) {
    case 'POST':
      return handleCreateEvent(req, res);
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

    const mongo = getMongo();
    const insert = await mongo.collection('events').insertOne({
      title,
      nanoid: nanoid(),
      availableDates: d,
      availableTimes: t
    });

    const event = await mongo.collection('events')
      .findOne({ _id: insert.insertedId });
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Invalid request' });
  }
}

function handleGetEvent(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({});
}

export default handler;
