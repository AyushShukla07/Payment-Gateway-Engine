import Ledger from '../domain/ledger/ledger.model.js';
import { fetchBankStatement } from './bankStatement.service.js';

export const reconcilePayments = async () => {
    const bankRecords = await fetchBankStatement();

    const ledgerEntries = await Ledger.find({
        referenceType: { $in: ['payment_captured', 'refund'] }
    });

    const ledgerMap = new Map();

    ledgerEntries.forEach(entry => {
        const key = `${entry.referenceId}_${entry.entryType}`;
        ledgerMap.set(key, entry);
    });

    const mismatches = [];

    bankRecords.forEach(bankTxn => {
        const expectedDebitKey = bankTxn.type === 'capture'
            ? `${bankTxn.paymentIntentId}_debit`
            : `${bankTxn.paymentIntentId}_credit`;

        if (!ledgerMap.has(expectedDebitKey)) {
            mismatches.push({
                paymentIntentId: bankTxn.paymentIntentId,
                issue: 'Missing Ledger entry',
                bankAmount: bankTxn.amount
            });
        }
    });

    return {
        totalBankRecords: bankRecords.length,
        totalLedgerEntries: ledgerEntries.length,
        mismatches
    };
};