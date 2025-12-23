export const authorizePayment = async ({ amount, currency }) => {
    await new Promise(res => setTimeout(res, Math.random() * 1000));// Simulating network latency

    const random = Math.random(); // Random failure scenarios

    // 10% network timeout
    if (random < 0.1) {
        throw new Error('BANK_TIMEOUT');
    }

    // 15% insufficient funds
    if (random < 0.25) {
        return {
            success: false,
            reason: 'INSUFFICIENT_FUNDS'
        };
    }
    return {
        success: true,
        bankRef: `BANK_REF_${Date.now()}`,
        authorizedAmount: amount,
        currency
    };
};