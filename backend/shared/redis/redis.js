import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: null, // needed for BullMQ
});

redis.on("connect", () => {
    console.log("Redis connected")
})

export default redis