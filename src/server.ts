import express from "express";
import { errorHandlerMiddleware } from "./middlewares/error-handler";

const server = express();

server.use(express.json());

server.use(errorHandlerMiddleware);

export { server };
