import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { UserService } from '@/user/user.service';
import { BadRequestException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  const mockUserRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => Should create a new user and return its data', async () => {
    const createUserDto = {
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    } as CreateUserDto;

    const user = {
      id: Date.now(),
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    } as User;

    const spy = jest.spyOn(mockUserRepository, 'save').mockResolvedValue(user);

    const result = await service.create(createUserDto);

    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalledWith(createUserDto);

    expect(result).toEqual(user);
    spy.mockRestore();
  });

  it('findAll => should return an array of user', async () => {
    const user = {
      id: Date.now(),
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    } as User;
    const users = [user];
    const spy = jest.spyOn(mockUserRepository, 'find').mockResolvedValue(users);

    const result = await service.findAll();

    expect(mockUserRepository.find).toHaveBeenCalled();
    expect(result).toEqual(users);
    spy.mockRestore();
  });

  describe('findOne', () => {
    it('findOne => should find a user by a given id and return its data', async () => {
      const id = 1;
      const user = {
        id: 1,
        firstname: 'Qui',
        lastname: 'Huynh',
        email: 'quichua333@gmail.com',
      } as User;

      const spy = jest
        .spyOn(mockUserRepository, 'findOne')
        .mockResolvedValue(user);

      const result = await service.findOne(id);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id },
      });
      expect(result).toEqual(user);
      spy.mockRestore();
    });
  });

  it('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    const id = 1;
    const user = {
      id: 1,
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    } as User;

    const spy = jest
      .spyOn(mockUserRepository, 'delete')
      .mockResolvedValue(user);

    const result = await service.remove(id);

    expect(mockUserRepository.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual(user);
    spy.mockRestore();
  });
});
