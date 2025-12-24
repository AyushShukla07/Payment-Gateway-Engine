import PaymentIntent, {
    PAYMENT_INTENT_STATUS
} from '../../domain/paymentIntent/paymentIntent.model.js';
import { authorizePayment } from '../../services/mockBank.service.js';
import { publishEvent } from '../../utils/eventPublisher.js';
import { createLedgerEntries } from '../../domain/ledger/ledger.service.js';

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
            intent.failureReason = bankResponse.reason;
            await intent.save();

            await publishEvent({
                type: 'payment.failed',
                payload: {
                    paymentIntentId: intent._id,
                    reason: bankResponse.reason,
                    merchantId: intent.merchantId
                }
            });

            return res.status(402).json({
                status: 'failed',
                reason: bankResponse.reason
            });
        }
        intent.status = PAYMENT_INTENT_STATUS.AUTHORIZED;
        intent.metadata.bankRef = bankResponse.bankRef;
        await intent.save();

        await publishEvent({
            type: 'payment.authorized',
            payload: {
                PaymentIntentId: intent._id,
                amount: intent.amount,
                merchantId: intent.merchantId
            }
        });

        await createLedgerEntries({
            correlationId:intent._id.toString(),
            amount:intent.amount,
            currency:intent.currency,
            referenceType:'payment_authorized',
            referenceId:intent._id.toString(),
            fromAccount:'customer_wallet',
            toAccount:'merchant_hold'
        });

        return res.json({
            status: 'authorized',
            bankRef: bankResponse.bankRef
        });
    } catch (err) {

        intent.status = PAYMENT_INTENT_STATUS.FAILED;
        intent.failureReason = 'BANK_TIMEOUT';
        await intent.save();

        await publishEvent({
            type: 'payment.failed',
            payload: {
                paymentIntentId: intent._id,
                reason: 'BANK_TIMEOUT',
                merchantId: intent.merchantId
            }
        });

        return res.status(504).json({
            error: 'Bank Timeout, try again'
        });
    }
};