import mongoose from 'mongoose';

const LedgerSchema = new mongoose.Schema({
    correlationId: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    entryType: {
        type: String,
        enum: ['debit', 'credit'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    referenceType: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Ledger', LedgerSchema);