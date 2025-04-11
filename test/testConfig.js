import Redis from 'ioredis';

export const API_VERSION = '/api/v1';
export const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6380');

export const CHAT_PORT = 5003;
export const CHAT_URL = `http://localhost:${CHAT_PORT}/chat`;

export const PRESENCE_PORT = 5002;
export const PRESENCE_URL = `http://localhost:${PRESENCE_PORT}/presence`;