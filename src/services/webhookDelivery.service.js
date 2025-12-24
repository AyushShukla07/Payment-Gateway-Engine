import fetch from 'node-fetch';
import { signPayload } from '../utils/webhookSigner.js';

export const deliverWebhook = async ({ url, secret, event }) => {
    const signature = signPayload(event, secret);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-signature': signature
        },
        body: JSON.stringify(event),
        timeout: 5000
    });
    return true;
};