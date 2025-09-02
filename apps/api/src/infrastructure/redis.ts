import { createClient, type RedisClientType } from 'redis';
import { config } from './config';

export const redisClient: RedisClientType = createClient({
  url: config.redis.url,
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  console.log('Redis Client Connected');
});

// Connect to Redis
redisClient.connect().catch(console.error);
