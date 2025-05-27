import { Router } from "express";
import userRouter from "./routes/user.routes";
import categoriesRouter from "./routes/category.routes";
import { bankAccountRouter } from "./routes/bank-account.routes";

const router = Router();

router.use(userRouter);
router.use("/categories", categoriesRouter);
router.use("/bank-accounts", bankAccountRouter);

export { router };
