import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase'
import { CreateStatementUseCase } from './CreateStatementUseCase';
import { OperationType } from '@modules/statements/entities/Statement';

let statementsRepository: InMemoryStatementsRepository;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase;

describe('Create statement', () => {
  beforeEach(() => {
    statementsRepository = new InMemoryStatementsRepository();
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
    createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
  });

  it('should be able to create statement', async () => {
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

    expect(statement).toHaveProperty('id');
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
