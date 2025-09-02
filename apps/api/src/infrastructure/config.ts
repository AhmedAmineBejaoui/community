import { z } from 'zod';

const configSchema = z.object({
  server: z.object({
    port: z.coerce.number().default(4000),
    host: z.string().default('0.0.0.0'),
  }),
  database: z.object({
    url: z.string(),
  }),
  redis: z.object({
    url: z.string(),
  }),
  jwt: z.object({
    secret: z.string(),
  }),
  cors: z.object({
    origin: z.union([z.string(), z.array(z.string())]).default('*'),
    credentials: z.boolean().default(true),
    methods: z.array(z.string()).default(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    allowedHeaders: z.array(z.string()).default(['Content-Type', 'Authorization']),
  }),
  log: z.object({
    level: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  }),
  s3: z.object({
    endpoint: z.string().optional(),
    region: z.string().default('us-east-1'),
    bucket: z.string(),
    accessKeyId: z.string(),
    secretAccessKey: z.string(),
  }),
  n8n: z.object({
    baseUrl: z.string(),
    webhookPath: z.string().default('/webhook/chat'),
    signingSecret: z.string(),
  }),
});

export const config = configSchema.parse({
  server: {
    port: process.env.PORT || process.env.API_PORT,
    host: process.env.HOST || process.env.API_HOST,
  },
  database: {
    url: process.env.MONGO_URI,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: process.env.CORS_CREDENTIALS === 'true',
    methods: process.env.CORS_METHODS?.split(','),
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS?.split(','),
  },
  log: {
    level: process.env.LOG_LEVEL,
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    region: process.env.S3_REGION,
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  n8n: {
    baseUrl: process.env.N8N_BASE_URL,
    webhookPath: process.env.N8N_CHAT_WEBHOOK_PATH,
    signingSecret: process.env.N8N_SIGNING_SECRET,
  },
});
