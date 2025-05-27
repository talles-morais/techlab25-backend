import { Router } from "express";
import { BankAccountController } from "../controllers/bank-account.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const bankAccountRouter = Router();
const bankAccountController = new BankAccountController();

/**
 * @swagger
 * /bank-accounts/create:
 *   post:
 *     summary: Cria uma nova conta bancária
 *     description: Utiliza middleware de autenticação.
 *     tags:
 *       - Contas bancárias
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum:
 *                   - CHECKING
 *                   - SAVINGS
 *                   - INVESTMENT
 *                   - OTHER
 *                 description: "Tipo da conta. Opções: CHECKING, SAVINGS, INVESTMENT, OTHER."
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso
 *       401:
 *         description: Não autorizado
 *       422:
 *         description: Dados inválidos
 */
bankAccountRouter.post(
  "/create",
  authMiddleware(),
  bankAccountController.createBankAccount
);

/**
 * @swagger
 * /bank-accounts/:
 *   get:
 *     summary: Lista todas as contas bancárias
 *     description: Retorna todas as contas bancárias cadastradas. Utiliza middleware de autenticação.
 *     tags:
 *       - Contas bancárias
 *     responses:
 *       200:
 *         description: Lista de contas bancárias retornada com sucesso
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
bankAccountRouter.get(
  "/",
  authMiddleware(),
  bankAccountController.getAllBankAccounts
);

/**
 * @swagger
 * /bank-accounts/{id}:
 *   put:
 *     summary: Atualiza uma conta bancária existente
 *     description: Atualiza os dados de uma conta bancária pelo ID. Utiliza middleware de autenticação.
 *     tags:
 *       - Contas bancárias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conta bancária a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum:
 *                   - CHECKING
 *                   - SAVINGS
 *                   - INVESTMENT
 *                   - OTHER
 *                 description: "Tipo da conta. Opções: CHECKING, SAVINGS, INVESTMENT, OTHER."
 *               balance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Conta bancária atualizada com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Conta bancária não encontrada
 *       422:
 *         description: Dados inválidos
 */
bankAccountRouter.put(
  "/:id",
  authMiddleware(),
  bankAccountController.updateBankAccount
);

/**
 * @swagger
 * /bank-accounts/{id}:
 *   delete:
 *     summary: Remove uma conta bancária
 *     description: Remove uma conta bancária pelo ID. Utiliza middleware de autenticação.
 *     tags:
 *       - Contas bancárias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da conta bancária a ser removida
 *     responses:
 *       200:
 *         description: Conta bancária removida com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Conta bancária não encontrada
 */
bankAccountRouter.delete(
  "/:id",
  authMiddleware(),
  bankAccountController.deleteBankAccount
);

export { bankAccountRouter };
