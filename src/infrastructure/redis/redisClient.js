import Redis from "ioredis";

const redis = new Redis({
    host: "redis",
    port: 6379,
    retryStrategy(times) {
        return Math.min(times * 50, 2000); // Retry every 50ms
    }
});

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("error", (err) => {
    console.error("Redis error:", err);
});

export default redis;