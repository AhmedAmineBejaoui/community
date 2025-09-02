import { z } from "zod";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load standard .env first, then .env.local if present (for local dev)
dotenv.config();
const localEnvPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(localEnvPath)) {
  dotenv.config({ path: localEnvPath, override: false });
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().transform(Number).default("4000"),
  MONGO_URI: z.string().min(1),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  NEXTAUTH_SECRET: z.string().min(1),
  CORS_ORIGINS: z.string().default("http://localhost:3000"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

const env = envSchema.parse(process.env);

export const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  mongoUri: env.MONGO_URI,
  redisUrl: env.REDIS_URL,
  nextAuthSecret: env.NEXTAUTH_SECRET,
  corsOrigins: env.CORS_ORIGINS.split(","),
  logLevel: env.LOG_LEVEL,
  isDevelopment: env.NODE_ENV === "development",
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",
};
