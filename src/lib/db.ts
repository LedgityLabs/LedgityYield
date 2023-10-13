import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
import { env } from "../../env.mjs";

export const prisma = new PrismaClient();

// Instantiate the Redis client
export const redis = new Redis({
  host: env.REDIS_HOST,
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
});
