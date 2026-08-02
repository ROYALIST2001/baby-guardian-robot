// FILE: src/config/redis.js
// JOB: Create the Redis connection once and share it.

const Redis = require("ioredis");

// Connect to the Redis container.
// "redis" is the service name from docker-compose.
// Docker turns that name into an address on its private network.
const redisClient = new Redis({
   host: "redis",
   port: 6379,
});

// Print a message when connected, so we can see it works.
redisClient.on("connect", function () {
   console.log("Redis: connected");
});

redisClient.on("error", function (err) {
   console.log("Redis error:", err.message);
});

module.exports = redisClient;
