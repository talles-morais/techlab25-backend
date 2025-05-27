import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const transactionRouter = Router();
const transactionController = new TransactionController();

/**
 * @swagger
 * /transactions:
 *   post:
 *     tags:
 *       - Transações
 *     summary: Criar uma nova transação
 *     description: |
 *       Cria uma nova transação entre contas, cartão de crédito ou pagamento de fatura.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromAccountId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID da conta de origem. Opcional.
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               toAccountId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID da conta de destino. Opcional.
 *                 example: "550e8400-e29b-41d4-a716-446655440001"
 *               creditCardId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID do cartão de crédito. Opcional.
 *                 example: "550e8400-e29b-41d4-a716-446655440002"
 *               invoiceId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 description: ID da fatura. Opcional.
 *                 example: "550e8400-e29b-41d4-a716-446655440003"
 *               categoryId:
 *                 type: string
 *                 format: uuid
 *                 description: ID da categoria.
 *                 example: "550e8400-e29b-41d4-a716-446655440004"
 *               amount:
 *                 type: number
 *                 description: Valor da transação.
 *                 example: 150.75
 *               description:
 *                 type: string
 *                 description: Descrição da transação.
 *                 example: "Pagamento de conta de luz"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Data da transação.
 *                 example: "2025-05-27T00:00:00Z"
 *               type:
 *                 type: string
 *                 enum:
 *                   - INCOME
 *                   - EXPENSE
 *                   - TRANSFER
 *                 example: "EXPENSE"
 *     responses:
 *       201:
 *         description: Transação criada com sucesso.
 *       400:
 *         description: Dados de entrada inválidos.
 *       401:
 *         description: Não autenticado. Verifique o cookie de sessão.
 *       404:
 *         description: Categoria ou conta não encontrada.
 *       422:
 *         description: Saldo insuficiente na conta de origem.
 *       500:
 *         description: Erro interno do servidor.
 */
transactionRouter.post(
  "/",
  authMiddleware(),
  transactionController.createTransaction
);

/**
 * @swagger
 * /transactions:
 *   get:
 *     tags:
 *       - Transações
 *     summary: Listar transações
 *     description: Retorna uma lista paginada de transações do usuário autenticado.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número da página para paginação.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Quantidade de itens por página.
 *     responses:
 *       200:
 *         description: Lista de transações retornada com sucesso.
 *       401:
 *         description: Não autenticado. Verifique o cookie de sessão.
 *       500:
 *         description: Erro interno do servidor.
 */
transactionRouter.get(
  "/",
  authMiddleware(),
  transactionController.getTransactions
);

export { transactionRouter };
