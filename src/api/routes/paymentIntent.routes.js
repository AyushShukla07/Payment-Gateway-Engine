import express from 'express';
import { createPaymentIntent } from '../controllers/paymentIntent.controller.js';

const router = express.Router();

router.post('/payment-intents', createPaymentIntent);

export default router;