import { getIdempotentResponse } from "../../utils/idempotency.js";

export const idempotencyMiddleware = async (req, res, next) => {
    const key = req.headers['idempotency-key'];

    if (!key) {
        return res.status(400).json({
            error: 'Idempotency-Key header is required'
        });
    }

    const cacheResponse = await getIdempotentResponse(key);

    if (cacheResponse) {
        return res.status(200).json(cacheResponse);
    }

    req.idempotencyKey = key;
    next();
};