import express from 'express';
import { refundPayment } from '../controllers/refund.controller.js';

const router = express.Router();

router.post('/payment-intents/:id/refund', refundPayment);

export default router;