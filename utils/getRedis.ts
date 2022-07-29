import { Redis } from '@upstash/redis';
import { SerializedEventData } from '@models/event';
import { SerializedEventResult } from '@models/Pick';

class RedisClient {
  private _redis: Redis;

  constructor() {
    const {
      UPSTASH_REDIS_REST_URL,
      UPSTASH_REDIS_REST_TOKEN
    } = process.env;
    if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) throw new Error(
      'UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set');
    this._redis = new Redis({
      url: UPSTASH_REDIS_REST_URL,
      token: UPSTASH_REDIS_REST_TOKEN,
    });
  }

  public setEvent(data: SerializedEventData) {
    return this._redis.set(`event:${data.nanoid}`, data);
  }

  public getEvent(nanoid: string) {
    return this._redis.get(`event:${nanoid}`) as unknown as SerializedEventData;
  }

  public setUser(nanoid: string, name: string, passwordHash?: string) {
    return this._redis.set(`event:${nanoid}:user:${name}`, {
      name,
      passwordHash,
    });
  }

  public getUser(nanoid: string, name: string): Promise<{
    name: string; passwordHash?: string;
  } | null> {
    return this._redis.get(`event:${nanoid}:user:${name}`);
  }

  public setPicks(nanoid: string, picks: SerializedEventResult[]) {
    return this._redis.set(`events:${nanoid}:picks`, picks);
  }

  public getPicks(nanoid: string): Promise<SerializedEventResult[] | null> {
    return this._redis.get(`events:${nanoid}:picks`);
  }
}

export default RedisClient;
