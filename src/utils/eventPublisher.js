import { eventQueue } from "../queues/event.queue.js";

export const publishEvent = async ({ type, payload }) => {
    await eventQueue.add(type, {
        type,
        payload,
        timestamp: new Date()
    });
};