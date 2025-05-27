import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { CategoryController } from "../controllers/category.controller";

const categoriesRouter = Router();
const categoryController = new CategoryController();

/**
 * @swagger
 * /categories:
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
  "/",
  authMiddleware(),
  categoryController.createCategory
);

/**
 * @swagger
 * /categories:
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
);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente
 *     description: Atualiza os dados de uma categoria pelo ID. Utiliza middleware de autenticação.
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Eletrodomésticos"
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Categoria não encontrada
 *       422:
 *         description: Dados inválidos
 */
categoriesRouter.put(
  "/:id",
  authMiddleware(),
  categoryController.updateCategory
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Remove uma categoria existente
 *     description: Remove uma categoria pelo ID. Utiliza middleware de autenticação.
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da categoria a ser removida
 *     responses:
 *       200:
 *         description: Categoria removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Categoria não encontrada
 */
categoriesRouter.delete(
  "/:id",
  authMiddleware(),
  categoryController.deleteCategory
);

export default categoriesRouter;
