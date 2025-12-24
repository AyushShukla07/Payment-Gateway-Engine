import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Merchant from '../src/domain/merchant/merchant.model.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await Merchant.create({
    merchantId: 'demo_merchant',
    'webhookUrl': 'http://localhost:5000/webhook',
    'webhookSecret': 'supersecret'
});

console.log('Merchant seeded');
process.exit();