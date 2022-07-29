import getRedis from '@utils/getRedis';
import { SerializedEventData } from '@models/event';

async function getEvent(nanoId: string) {
  const redis = await getRedis();
  const event = await redis.get(`event:${nanoId}`);
  if (!event) throw new Error(`Event ${nanoId} not found`);
  return event as SerializedEventData;
}

export default getEvent;
