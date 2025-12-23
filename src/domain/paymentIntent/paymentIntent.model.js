import mongoose from 'mongoose';

export const PAYMENT_INTENT_STATUS = {
    CREATED: 'created',
    AUTHORIZED: 'authorized',
    CAPTURED: 'captured',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

const PaymentIntentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: Object.values(PAYMENT_INTENT_STATUS),
        default: PAYMENT_INTENT_STATUS.CREATED
    },
    merchantId: {
        type: String,
        required: true
    },
    metadata: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    capturedAmount: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('PaymentIntent', PaymentIntentSchema);