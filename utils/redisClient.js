import { createClient } from "redis";

const client = createClient({
  socket: { host: "127.0.0.1", port: 6379, connectTimeout: 3000 }
});

client.on("error", (err) => {
  if (!err.message.includes("ConnectionTimeoutError")) return;
});

await client.connect();
console.log("Redis connected successfully!");

export default client;
