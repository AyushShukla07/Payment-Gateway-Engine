import Redis from 'ioredis';

const redis=new Redis({
    host:process.env.REDIS_HOST,
    port:process.env.REDIS_PORT,

    maxRetriesPerRequest:null,
    enableReadyCheck:false
});

redis.on('connect',()=>{
    console.log('Redis Connected');
});
redis.on('error',err=>{
    console.error('Redis error ',err);
});

export default redis;