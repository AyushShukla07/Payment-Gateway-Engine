import Ledger from './ledger.model.js';

export const createLedgerEntries = async ({
    correlationId,
    amount,
    currency,
    referenceType,
    referenceId,
    fromAccount,
    toAccount
}) => {
    const entries = [
        {
            correlationId,
            account: fromAccount,
            entryType: 'debit',
            amount,
            currency,
            referenceType,
            referenceId
        },
        {
            correlationId,
            account: toAccount,
            entryType: 'credit',
            amount,
            currency,
            referenceType,
            referenceId
        }
    ];

    await Ledger.insertMany(entries);
};