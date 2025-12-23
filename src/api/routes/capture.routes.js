import express from 'express';
import { capturePaymentIntent } from '../controllers/capture.controller.js';

const router = express.Router();

router.post('/payment-intents/:id/capture', capturePaymentIntent);

export default router;