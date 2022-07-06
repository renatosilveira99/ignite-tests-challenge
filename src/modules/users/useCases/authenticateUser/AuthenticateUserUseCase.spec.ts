import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it('should be able to authenticate an user', async () => {
    await createUserUseCase.execute({
      name: 'fake-name',
      email: 'fake-email',
      password: 'fake-password'
    });

    const sessionToken = await authenticateUserUseCase.execute({
      email: 'fake-email',
      password: 'fake-password'
    });

    expect(sessionToken).toHaveProperty('token')
  });

  it('should not be able to authenticate user with wrong email', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'fake-email',
        password: 'fake-password'
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user with wrong password', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'fake-name',
        email: 'fake-email',
        password: 'fake-password'
      });

      await authenticateUserUseCase.execute({
        email: 'fake-email',
        password: 'fa-ke'
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
