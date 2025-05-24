import "reflect-metadata"
import * as dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data-source";
import { server } from "./server";
import config from "./config/config";

AppDataSource.initialize()
  .then(async () => {
    const PORT = config.port || 3333;
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
