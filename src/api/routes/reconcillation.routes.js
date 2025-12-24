import express from 'express';
import { runReconcillation } from '../controllers/reconcillation.controller.js';

const router = express.Router();

router.get('/reconcillation/run', runReconcillation);

export default router;