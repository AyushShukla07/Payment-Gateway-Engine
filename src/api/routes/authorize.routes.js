import express from 'express';
import { authorizePaymentIntent } from '../controllers/authorize.controller.js';

const router=express.Router();

router.post('/payment-intents/:id/authorize',authorizePaymentIntent);

export default router;