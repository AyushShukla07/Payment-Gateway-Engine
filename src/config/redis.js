import IORedis from 'ioredis';

const redis=new IORedis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT
});

redis.on('connect',()=>{
    console.log('Redis Connected');
});
redis.on('error',err=>{
    console.error('Redis error ',err);
});

export default redis;