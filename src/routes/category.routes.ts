import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CategoryController } from "../controllers/category.controller";

const categoriesRouter = Router();
const categoryController = new CategoryController();

categoriesRouter.post(
  "/create",
  authMiddleware(),
  categoryController.createCategory
);

export default categoriesRouter;
