import { reconcilePayments } from "../../services/reconcillation.service.js";

export const runReconcillation = async (_, res) => {
    const report = await reconcilePayments();
    res.json(report);
}