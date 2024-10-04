import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { User } from '@/user/entities/user.entity';
import { UpdateUserDto } from '@/user/dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create => should create a new user by a given data', async () => {
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

    const spy = jest.spyOn(mockUsersService, 'create').mockResolvedValue(user);

    const result = await controller.create(createUserDto);

    expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);

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
    const spy = jest
      .spyOn(mockUsersService, 'findAll')
      .mockResolvedValue(users);

    const result = await controller.findAll();

    expect(mockUsersService.findAll).toHaveBeenCalled();
    expect(result).toEqual(users);
    spy.mockRestore();
  });

  it('findOne => should find a user by a given id and return its data', async () => {
    const id = '1';
    const user = {
      id: 1,
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    } as User;

    const spy = jest.spyOn(mockUsersService, 'findOne').mockResolvedValue(user);

    const result = await controller.findOne(id);

    expect(mockUsersService.findOne).toHaveBeenCalledWith(+id);
    expect(result).toEqual(user);
    spy.mockRestore();
  });

  it('update => should find a user by a given id and update its data', async () => {
    const id = '1';
    const updateUserDto = {
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    } as UpdateUserDto;
    const user = {
      id: 1,
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    } as User;

    const spy = jest.spyOn(mockUsersService, 'update').mockReturnValue(user);

    const result = await controller.update(id, updateUserDto);

    expect(mockUsersService.update).toHaveBeenCalledWith(+id, updateUserDto);
    expect(result).toEqual(user);
    spy.mockRestore();
  });

  it('remove => should find a user by a given id, remove and then return Number of affected rows', async () => {
    const id = '1';
    const user = {
      id: 1,
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    } as User;

    const spy = jest.spyOn(mockUsersService, 'remove').mockResolvedValue(user);

    const result = await controller.remove(id);

    expect(mockUsersService.remove).toHaveBeenCalledWith(+id);
    expect(result).toEqual(user);

    spy.mockRestore();
  });
});
