import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import Merchant from '../domain/merchant/merchant.model.js';
import { deliverWebhook } from '../services/webhookDelivery.service.js';
import { dlqQueue } from '../queues/dlq.queue.js';

const worker = new Worker(
    'payment-events',
    async job => {

        const { type, payload } = job.data;
        const merchant = await Merchant.findOne({
            merchantId: payload.merchantId
        });

        if (!merchant) {
            throw new error('Merchant not found');
        }

        try {
            await deliverWebhook({
                url: merchant.webhookUrl,
                secret: merchant.webhookSecret,
                event: {
                    type,
                    payload
                }
            });
        } catch (err) {
            if (job.attemptsMade + 1 >= job.opts.attempts) {
                await dlqQueue.add('webhook_failed', {
                    type,
                    payload,
                    error: err.message
                });
            }
            throw err;
        }
    },
    {
        connection: redis,
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 1000
        }
    }
);

export default worker;