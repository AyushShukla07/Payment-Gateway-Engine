import PaymentIntent, {
    PAYMENT_INTENT_STATUS
} from '../../domain/paymentIntent/paymentIntent.model.js';
import Refund from '../../domain/refund/refund.model.js';
import { createLedgerEntries } from '../../domain/ledger/ledger.service.js';
import { eventQueue } from '../../queues/event.queue.js';

export const refundPayment = async (req, res) => {
    const { id } = req.params;
    const amount = req.body?.amount;
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
        return res.status(400).json({
            error: 'Idempotency-Key required'
        });
    }

    const existingRefund = await Refund.findOne({
        idempotencyKey
    });
    if (existingRefund) {
        return res.json(existingRefund);
    }

    const intent = await PaymentIntent.findById(id);

    if (!intent) {
        return res.status(404).json({ error: 'PaymentIntent not found' });
    }

    if (![PAYMENT_INTENT_STATUS.CAPTURED, PAYMENT_INTENT_STATUS.PARTIALLY_REFUNDED].includes(intent.status)) {
        return res.status(400).json({
            error: `Cannot refund payment in '${intent.status}' state`
        });
    }

    const alreadyRefunded = intent.refundedAmount || 0;
    const refundableAmount = intent.capturedAmount - alreadyRefunded;
    const refundAmount = amount ?? refundableAmount;

    if (refundAmount <= 0 || refundAmount > refundableAmount) {
        return res.status(400).json({ error: 'Invalid refund amount' });
    }

    const refund = await Refund.create({
        paymentIntentId: intent._id,
        amount: refundAmount,
        currency: intent.currency,
        idempotencyKey,
        status: 'succeeded'
    });

    intent.refundedAmount = alreadyRefunded + refundAmount;
    intent.status =
        intent.refundedAmount === intent.capturedAmount
            ? PAYMENT_INTENT_STATUS.REFUNDED
            : PAYMENT_INTENT_STATUS.PARTIALLY_REFUNDED;

    await intent.save();

    await createLedgerEntries({
        correlationId: intent._id.toString(),
        amount: refundAmount,
        currency: intent.currency,
        referenceType: 'refund',
        referenceId: refund._id.toString(),
        fromAccount: 'merchant_wallet',
        toAccount: 'customer_wallet'
    });

    console.log('Enqueuing webhook event', {
        paymentIntentId: intent._id.toString(),
        merchantId: intent.merchantId
    });


    await eventQueue.add('payment.refunded', {
        type: 'payment.refunded',
        payload: {
            paymentIntentId: intent._id.toString(),
            merchantId: intent.merchantId,
            refundId: refund._id.toString(),
            amount: refundAmount,
            currency: intent.currency
        }
    });

    return res.json({
        status: 'refunded',
        refundId: refund._id,
        amount: refundAmount
    });
};