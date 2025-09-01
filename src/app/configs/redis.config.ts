/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "redis";
import { envVarriables } from "./envVars.config";

export const redisClient = createClient({
  username: envVarriables.REDIS.REDIS_USERNAME as string,
  password: envVarriables.REDIS.REDIS_PASSWORD as string,
  socket: {
    host: envVarriables.REDIS.REDIS_HOST as string,
    port: Number(envVarriables.REDIS.REDIS_PORT as string),
  },
});

redisClient.on(
  "connect",
  () =>
    envVarriables.NODE_ENV === "Development" &&
    console.log("Redis: connecting..."),
);

redisClient.on(
  "ready",
  () =>
    envVarriables.NODE_ENV === "Development" &&
    console.log("Redis: ready to accept commands"),
);

redisClient.on(
  "reconnecting",
  () =>
    envVarriables.NODE_ENV === "Development" &&
    console.log("Redis: reconnecting..."),
);

redisClient.on(
  "end",
  () =>
    envVarriables.NODE_ENV === "Development" &&
    console.log("Redis: connection closed"),
);

redisClient.on(
  "error",
  (err: any) =>
    envVarriables.NODE_ENV === "Development" &&
    console.log("Redis Client Error", err),
);

export const conectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    if (envVarriables.NODE_ENV === "Development") {
      console.log("Redis successfully connected");
    }
  }
};
