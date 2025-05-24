import express from "express";
import swaggerUi from "swagger-ui-express";
import cookieParser from "cookie-parser";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { router } from "./routes";
import swaggerSpec from "./swagger";

const server = express();

server.use(express.json());

server.use(cookieParser());

server.use(router);

server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

server.use(errorHandlerMiddleware);

export { server };
