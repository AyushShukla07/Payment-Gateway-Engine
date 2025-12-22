import express from 'express';

const app = express();

app.use(express.json());

app.get('/health', (_, res) => {
    res.json({
        status: 'ok',
        service: 'payment-gateway-engine',
        timestamp: new Date()
    });
});

export default app;