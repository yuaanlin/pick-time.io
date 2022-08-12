import { Redis } from '@upstash/redis';
import IoRedis from 'ioredis';
import { SerializedEventData } from '@models/event';
import { SerializedEventResult } from '@models/Pick';

class RedisClient {
  private _redis: Redis | IoRedis;

  constructor() {
    const {
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN,
      USE_IOREDIS
    } = process.env;
    if (USE_IOREDIS) {
      this._redis = new IoRedis();
    } else {
      if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) throw new Error(
        'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
      this._redis = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      });
    }
  }

  public async setEvent(data: SerializedEventData) {
    return await this._redis.set(`event:${data.nanoid}`, JSON.stringify(data));
  }

  public async getEvent(nanoid: string) {
    return JSON.parse(await this._redis.get(`event:${nanoid}`) || '{}') as unknown as SerializedEventData;
  }

  public async setUser(nanoid: string, name: string, passwordHash?: string) {
    return await this._redis.set(`event:${nanoid}:user:${name}`, JSON.stringify({
      name,
      passwordHash,
    }));
  }

  public async getUser(nanoid: string, name: string): Promise<{
    name: string; passwordHash?: string;
  } | null> {
    return JSON.parse(await this._redis.get(`event:${nanoid}:user:${name}`) || '{}');
  }

  public async setPicks(nanoid: string, picks: SerializedEventResult[]) {
    return await this._redis.set(`events:${nanoid}:picks`, JSON.stringify(picks));
  }

  public async getPicks(nanoid: string): Promise<SerializedEventResult[] | null> {
    return JSON.parse(await this._redis.get(`events:${nanoid}:picks`) || '[]');
  }
}

export default RedisClient;
