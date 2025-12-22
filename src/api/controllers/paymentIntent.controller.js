import PaymentIntent from '../../domain/paymentIntent/paymentIntent.model.js';

export const createPaymentIntent = async (req, res) => {
    const { amount, currency, metadata } = req.body;
    const merchantId = req.user?.merchentId || 'demo_merchant';


    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    const intent = await PaymentIntent.create({
        amount,
        currency,
        merchantId,
        metadata
    });

    return res.status(201).json({
        id: intent._id,
        amount: intent.amount,
        currency: intent.currency,
        status: intent.status
    });
};