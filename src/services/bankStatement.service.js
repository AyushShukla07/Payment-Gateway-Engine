export const fetchBankStatement = async () => {
    return [
        {
            referenceId: 'SETTLEMENT_1',
            paymentIntentId: 'mock_intent_1',
            amount: 5000,
            currency: 'INR',
            type: 'capture'
        },
        {
            referenceId: 'SETTLEMENT_2',
            paymentIntentId: 'mock_intent_2',
            amount: 3000,
            currency: 'INR',
            type: 'refund'
        }
    ];
};