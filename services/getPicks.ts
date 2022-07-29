import getRedis from '@utils/getRedis';

async function getPicks(nanoid: string) {
  const redis = await getRedis();
  const picks = await redis.get(`event:${nanoid}:picks`);
  if (!picks) return [];
  return picks as string[];
}

export default getPicks;
