import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

import { CreateUserUseCase } from './CreateUserUseCase';

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'fake-name',
      email: 'fake-email',
      password: 'fake-password'
    });

    expect(user.email).toBe('fake-email');
  });

  it('should not be able to create a new user with the same email', async () => {
    expect(async () => {
    await createUserUseCase.execute({
        name: 'fake-name',
        email: 'fake-email',
        password: 'fake-password'
      });

    await createUserUseCase.execute({
        name: 'fake-name',
        email: 'fake-email',
        password: 'fake-password'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
