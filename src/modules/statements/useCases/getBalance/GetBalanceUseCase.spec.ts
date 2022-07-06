import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase'
import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase';
import { GetBalanceUseCase } from '../getBalance/GetBalanceUseCase'

import { OperationType } from '@modules/statements/entities/Statement';

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get statement', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
  });

  it('should be able to get balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'fake-name',
      email: 'fake-email',
      password: 'fake-password'
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: 'test deposit'
    });

    await createStatementUseCase.execute({
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 400,
      description: 'test withdraw'
    });

    const balance = await getBalanceUseCase.execute({
      user_id: user.id
    });

    expect(balance.balance).toBe(600)
  });

  it('should not be able get balance with invalid user id', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'fake-id',
        type: OperationType.DEPOSIT,
        amount: 1000,
        description: 'test deposit'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
