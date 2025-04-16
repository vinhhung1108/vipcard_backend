import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const createUserDto = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
    };
    const hashedPassword = 'hashed';
    const savedUser = {
      id: 1,
      ...createUserDto,
      password: hashedPassword,
      roles: ['default'],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
    jest.spyOn(repository, 'create').mockReturnValue(savedUser);
    jest.spyOn(repository, 'save').mockResolvedValue(savedUser);

    const result = await service.createUser(createUserDto);
    expect(result.username).toEqual('testuser');
    expect(result.roles).toEqual(['default']);
    expect(result.password).toBeUndefined();
  });
});