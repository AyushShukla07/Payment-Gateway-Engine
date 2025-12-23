import PaymentIntent, {
    PAYMENT_INTENT_STATUS
} from '../../domain/paymentIntent/paymentIntent.model.js';
import { authorizePayment } from '../../services/mockBank.service.js';

export const authorizePaymentIntent = async (req, res) => {
    const { id } = req.params;

    const intent = await PaymentIntent.findById(id);

    if (!intent) {
        return res.status(404).json({ error: 'PaymentIntent not found' });
    }

    if (intent.status !== PAYMENT_INTENT_STATUS.CREATED) {
        return res.status(400).json({
            error: `Cannot authorize payment in '${intent.status}' state`
        });
    }
    try {
        const bankResponse = await authorizePayment({
            amount: intent.amount,
            currency: intent.currency
        });

        if (!bankResponse.success) {
            intent.status = PAYMENT_INTENT_STATUS.FAILED;
            await intent.save();

            return res.status(402).json({
                status: 'failed',
                reason: bankResponse.reason
            });
        }
        intent.status = PAYMENT_INTENT_STATUS.AUTHORIZED;
        intent.metadata.bankRef = bankResponse.bankRef;
        await intent.save();

        return res.json({
            status: 'authorized',
            bankRef: bankResponse.bankRef
        });
    } catch (err) {
        return res.status(504).json({
            error: 'Bank Timeout, try agin'
        });
    }
};