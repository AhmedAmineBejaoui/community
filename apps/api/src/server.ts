import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import pino from "pino";
import pinoHttp from "pino-http";
import { config } from "./config";
import { errorHandler } from "./interfaces/http/middlewares/errorHandler";
import { notFoundHandler } from "./interfaces/http/middlewares/notFoundHandler";
import { communityRoutes } from "./interfaces/http/routes/communities";
import { postRoutes } from "./interfaces/http/routes/posts";
import { chatRoutes } from "./interfaces/http/routes/chat";
import { integrationsRoutes } from "./interfaces/http/routes/integrations";
import { uploadRoutes } from "./interfaces/http/routes/uploads";

const logger = pino({ level: config.logLevel });

const app: Express = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  }),
);
app.use(pinoHttp({ logger }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/healthz", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/v1/communities", communityRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/integrations/n8n", integrationsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port || 4000;

app.listen(PORT, () => {
  logger.info(`🚀 API server running on port ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/healthz`);
});

export default app;
