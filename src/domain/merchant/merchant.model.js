import mongoose from 'mongoose';

const MerchnatSchema = new mongoose.Schema({
    merchantId: {
        type: String,
        required: true,
        unique: true
    },
    webhookUrl: {
        type: String,
        required: true,
    },
    webhookSecret: {
        type: String,
        required: true
    }
});

export default mongoose.model('Merchant', MerchnatSchema);