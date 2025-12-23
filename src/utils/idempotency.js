import redis from '../config/redis.js';

const IDEMPOTENCY_TTL = 60 * 10;

export const getIdempotentResponse = async (key) => {
    const data = await redis.get(`idempotency:${key}`);
    return data ? JSON.parse(data) : null;
};

export const setIdempotentResponse = async (key, response) => {
    await redis.set(
        `idempotency:${key}`,
        JSON.stringify(response),
        'EX',
        IDEMPOTENCY_TTL
    );
};