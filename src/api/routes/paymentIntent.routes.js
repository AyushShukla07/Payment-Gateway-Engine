import express from 'express';
import { createPaymentIntent } from '../controllers/paymentIntent.controller.js';
import { idempotencyMiddleware } from '../middleware/idempotency.middleware.js';

const router = express.Router();

router.post('/payment-intents', idempotencyMiddleware, createPaymentIntent);

export default router; 