import { Worker } from 'bullmq';
import redis from '../config/redis.js';

const worker = new Worker(
    'payment-events',
    async job => {

        const { type, payload } = job.data;

        console.log('Webhook event recieved: ', type, payload);
    },
    { connection: redis }
);

export default worker;