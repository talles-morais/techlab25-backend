import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { router } from "./routes";
import swaggerSpec from "./swagger";
import config from "./config/config";

const server = express();

server.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

server.use(express.json());

server.use(cookieParser());

server.use(router);

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use(errorHandlerMiddleware);

export { server };
