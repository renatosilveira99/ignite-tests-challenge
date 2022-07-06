import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository)
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'fake-name',
      email: 'fake-email',
      password: 'fake-password'
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toHaveProperty('id');
    expect(userProfile).toHaveProperty('name');
    expect(userProfile).toHaveProperty('email');
  });

  it('should not be able show user profile with invalid id', async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('fake-id');
    }).rejects.toBeInstanceOf(AppError);
  });
});
