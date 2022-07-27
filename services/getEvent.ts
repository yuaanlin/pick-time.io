import getMongo from '@utils/getMongo';

async function getEvent(nanoId: string) {
  const mongo = await getMongo();
  const find: any = await mongo.collection('events')
    .findOne({ nanoid: nanoId });
  if (!find) throw new Error('Event not found: ' + nanoId);
  find._id = find?._id.toHexString();
  return find;
}

export default getEvent;
