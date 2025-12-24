import PaymentIntent, {
    PAYMENT_INTENT_STATUS
} from '../../domain/paymentIntent/paymentIntent.model.js';
import { publishEvent } from '../../utils/eventPublisher.js';
import { createLedgerEntries } from '../../domain/ledger/ledger.service.js';

export const capturePaymentIntent = async (req, res) => {
    const { id } = req.params;
    // const { amount } = req.body;
    const requestedAmount = req.body?.amount;

    const intent = await PaymentIntent.findById(id);

    if (!intent) {
        return res.status(404).json({ error: 'PaymentIntent not found' });
    }

    if (intent.status !== PAYMENT_INTENT_STATUS.AUTHORIZED && intent.status !== PAYMENT_INTENT_STATUS.PARTIALLY_CAPTURED) {
        return res.status(400).json({
            error: `Cannot capture payment in '${intent.status}' state`
        });
    }

    const alreadyCaptured = intent.capturedAmount || 0;
    const remainingAmount = intent.amount - alreadyCaptured;
    const captureAmount = requestedAmount ?? remainingAmount;

    if (captureAmount <= 0) {
        return res.status(400).json({
            error: 'Capture amount must be greater than zero'
        });
    }

    if (captureAmount > remainingAmount) {
        return res.status(400).json({
            error: 'Capture amount exceeds remaining authorized amount'
        });
    }

    intent.capturedAmount = alreadyCaptured + captureAmount;

    if (intent.capturedAmount === intent.amount) {
        intent.status = PAYMENT_INTENT_STATUS.CAPTURED;
    } else {
        intent.status = PAYMENT_INTENT_STATUS.PARTIALLY_CAPTURED;
    }

    await intent.save();

    await publishEvent({
        type: 'payment.captured',
        payload: {
            paymentIntentId: intent._id,
            capturedAmount: captureAmount,
            merchantId: intent.merchantId
        }
    });

    await createLedgerEntries({
        correlationId: intent._id.toString(),
        amount: captureAmount,
        currency: intent.currency,
        referenceType: 'payment_captured',
        referenceId: intent._id.toString(),
        fromAccount: 'merchant_hold',
        toAccount: 'merchant_wallet'
    });

    return res.json({
        id: intent._id,
        status: intent.status,
        capturedAmount: intent.capturedAmount
    });
};