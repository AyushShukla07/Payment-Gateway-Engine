import dotenv from 'dotenv';
dotenv.config();

import './config/env.js';
import { connectMongo } from './config/mongo.js';
import redis from './config/redis.js';
import app from './app.js';
import './workers/webhook.worker.js';

const PORT = process.env.PORT;

const startServer = async () => {
    await connectMongo();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully ...');
    await redis.quit();
    process.exit(0);
});