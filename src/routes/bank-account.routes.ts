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

export { bankAccountRouter }