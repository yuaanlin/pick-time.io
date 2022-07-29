import getMongo from '@utils/getMongo';

async function getPicks(nanoid: string) {
  const mongo = await getMongo();
  return await mongo.collection('picks').aggregate([
    { $match: { eventId: nanoid } },
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
}

export default getPicks;
