import dotenv from 'dotenv';
dotenv.config();

const requiredEnv = [
    'PORT',
    'MONGO_URI',
    'REDIS_HOST',
    'REDIS_PORT'
];

requiredEnv.forEach(key => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});