import redis from "redis";
import dotenv from "dotenv";
dotenv.config();

const client = redis.createClient();
client
    .connect({
        url: "redis://localhost:6379",
    })
    .then(() => {
        console.log("Redis: DB connected");
    });

client.on("error", (err) => {
    console.log("Redis: " + err.message);
});

const getOrSetCache = async (key, cb) => {
    try {
        const data = await client.get(key);
        if (data != null) {
            console.log("Redis: Cache hit");
            return JSON.parse(data);
        } else {
            console.log("Redis: Cache miss");
            const freshData = await cb();
            client.setEx(
                key,
                process.env.DEFAULT_EXPIRATION,
                JSON.stringify(freshData)
            );
            return freshData;
        }
    } catch (err) {
        console.log("Redis: " + err.message);
        return null;
    }
};

export default getOrSetCache;
