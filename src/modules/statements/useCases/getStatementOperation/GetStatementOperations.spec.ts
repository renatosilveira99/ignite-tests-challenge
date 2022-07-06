import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase'
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetStatementOperationUseCase } from '../getStatementOperation/GetStatementOperationUseCase'

import { OperationType } from '@modules/statements/entities/Statement';

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get balance', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepository,
      statementsRepository,
    )
  });

  it('should be able to get a statement operation', async () => {
    const user = await createUserUseCase.execute({
      name: 'fake-name',
      email: 'fake-email',
      password: 'fake-password'
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'test deposit'
    });

    const operation = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    });

    expect(operation).toHaveProperty('id')
    expect(operation.amount).toBe(1000);
  });

  it('should not be able to get statement operation with invalid user id', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'fake-name',
        email: 'fake-email',
        password: 'fake-password'
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: 'test deposit'
      });

      await getStatementOperationUseCase.execute({
        user_id: 'fake-id',
        statement_id: statement.id
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to get statement operation with invalid statement id', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'fake-name',
        email: 'fake-email',
        password: 'fake-password'
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id,
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: 'test deposit'
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: 'fake-id'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
