import { Router } from "express";
import userRouter from "./routes/user.routes";
import categoriesRouter from "./routes/category.routes";

const router = Router();

router.use(userRouter);
router.use("/categories", categoriesRouter);

export { router };
