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

/**
 * @swagger
 * /categories/:
 *   get:
 *     summary: Lista todas as categorias
 *     description: Retorna todas as categorias cadastradas. Utiliza middleware de autenticação.
 *     tags:
 *       - Categorias
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   name:
 *                     type: string
 *                     example: "Eletrônicos"
 *       401:
 *         description: Não autorizado
 */
categoriesRouter.get(
  "/",
  authMiddleware(),
  categoryController.getAllCategories
)

export default categoriesRouter;
