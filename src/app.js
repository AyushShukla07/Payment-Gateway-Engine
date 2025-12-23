import express from 'express';
import paymentIntentRoutes from './api/routes/paymentIntent.routes.js';
import authorizeRoutes from './api/routes/authorize.routes.js';
import captureRoutes from './api/routes/capture.routes.js';

const app = express();

app.use(express.json());
app.use('/api', paymentIntentRoutes);
app.use('/api', authorizeRoutes);
app.use('/api', captureRoutes);

app.get('/health', (_, res) => {
    res.json({
        status: 'ok',
        service: 'payment-gateway-engine',
        timestamp: new Date()
    });
});

export default app;