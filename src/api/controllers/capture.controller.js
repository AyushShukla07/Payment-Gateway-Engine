import PaymentIntent, {
    PAYMENT_INTENT_STATUS
} from '../../domain/paymentIntent/paymentIntent.model.js';

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

    const captureAmount = requestedAmount || intent.amount;
    const alreadyCaptured = intent.capturedAmount || 0;

    if (alreadyCaptured + captureAmount > intent.amount) {
        return res.status(400).json({
            error: 'Capture amount exceeds authorized amount'
        });
    }
    intent.capturedAmount = alreadyCaptured + captureAmount;

    if (intent.capturedAmount === intent.amount) {
        intent.status = PAYMENT_INTENT_STATUS.CAPTURED;
    } else {
        intent.status = PAYMENT_INTENT_STATUS.PARTIALLY_CAPTURED;
    }

    await intent.save();

    return res.json({
        id: intent._id,
        status: intent.status,
        capturedAmount: intent.capturedAmount
    });
};