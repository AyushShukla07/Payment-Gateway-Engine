// import fetch from 'node-fetch';
import { signPayload } from '../utils/webhookSigner.js';

export const deliverWebhook = async ({ url, secret, event }) => {
    const signature = signPayload(event, secret);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-signature': signature
            },
            body: JSON.stringify(event),
            timeout: 5000
        });
        if (!response.ok) {
            throw new error(`Webhook failed with status ${response.status}`);
        }
        return true;
    } finally {
        clearTimeout(timeoutId);
    }
};