import * as dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { server } from "./server";

AppDataSource.initialize()
  .then(async () => {
    const PORT = process.env.PORT || 3333;
    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
