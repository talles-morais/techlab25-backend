import { DataSource, EntityManager, QueryRunner } from "typeorm";
import { TransactionService } from "../../../src/services/transaction.service";
import { BankAccountRepository } from "../../../src/repositories/bank-account.repository";
import { CategoryRepository } from "../../../src/repositories/category.repository";
import { TransactionRepository } from "../../../src/repositories/transaction.repository";

jest.mock("../../../src/repositories/bank-account.repository");
jest.mock("../../../src/repositories/category.repository");
jest.mock("../../../src/repositories/transaction.repository");

export type SUT = {
  sut: TransactionService;
  dataSourceMock: jest.Mocked<DataSource>;
  queryRunnerMock: jest.Mocked<QueryRunner>;
  entityManagerMock: jest.Mocked<EntityManager>;
  bankAccountRepositoryMock: jest.Mocked<BankAccountRepository>;
  categoryRepositoryMock: jest.Mocked<CategoryRepository>;
  transactionRepositoryMock: jest.Mocked<TransactionRepository>;
};

export const makeSutForTransactionService = (): SUT => {
  // Mock do EntityManager
  const entityManagerMock = {} as jest.Mocked<EntityManager>;

  // Mock do QueryRunner
  const queryRunnerMock = {
    connect: jest.fn().mockResolvedValue(undefined),
    startTransaction: jest.fn().mockResolvedValue(undefined),
    commitTransaction: jest.fn().mockResolvedValue(undefined),
    rollbackTransaction: jest.fn().mockResolvedValue(undefined),
    release: jest.fn().mockResolvedValue(undefined),
    manager: entityManagerMock,
  } as unknown as jest.Mocked<QueryRunner>;

  // Mock do DataSource
  const dataSourceMock = {
    createQueryRunner: jest.fn().mockReturnValue(queryRunnerMock),
    manager: entityManagerMock,
  } as unknown as jest.Mocked<DataSource>;

  // Criar mocks completos dos repositórios
  const bankAccountRepositoryMock = jest.mocked({
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as BankAccountRepository);

  const categoryRepositoryMock = jest.mocked({
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as CategoryRepository);

  const transactionRepositoryMock = jest.mocked({
    create: jest.fn(),
    findAll: jest.fn(),
    findWithPagination: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as TransactionRepository);

  const BankAccountRepositoryMock = BankAccountRepository as jest.MockedClass<typeof BankAccountRepository>;
  const CategoryRepositoryMock = CategoryRepository as jest.MockedClass<typeof CategoryRepository>;
  const TransactionRepositoryMock = TransactionRepository as jest.MockedClass<typeof TransactionRepository>;

  BankAccountRepositoryMock.mockImplementation(() => bankAccountRepositoryMock);
  CategoryRepositoryMock.mockImplementation(() => categoryRepositoryMock);
  TransactionRepositoryMock.mockImplementation(() => transactionRepositoryMock);

  // System Under Test
  const sut = new TransactionService(dataSourceMock);

  return {
    sut,
    dataSourceMock,
    queryRunnerMock,
    entityManagerMock,
    bankAccountRepositoryMock,
    categoryRepositoryMock,
    transactionRepositoryMock,
  };
};

// Função para limpar todos os mocks
export const clearAllMocks = (): void => {
  jest.clearAllMocks();
};

// Função para restaurar todos os mocks
export const restoreAllMocks = (): void => {
  jest.restoreAllMocks();
};
