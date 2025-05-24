import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CategoryController } from "../controllers/category.controller";

const categoriesRouter = Router();
const categoryController = new CategoryController();

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Cria uma nova categoria
 *     description: Utiliza middleware de autenticação.
 *     tags:
 *       - Categorias
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Eletrônicos"
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       401:
 *         description: Não autorizado
 *       422:
 *         description: Dados inválidos
 */
categoriesRouter.post(
  "/create",
  authMiddleware(),
  categoryController.createCategory
);

export default categoriesRouter;
