import * as request from 'supertest';
import { User } from '@/user/entities/user.entity';
import { UserModule } from '@/user/user.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'unittest',
          password: 'unittest',
          database: 'unittestdb',
          entities: [User],
          synchronize: true,
        }),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });
  beforeEach(async () => {
    await repository.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user (POST)', async () => {
    const createUserDto = {
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    };

    return request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201)
      .then((res) => {
        const { id, firstname, lastname, email } = res.body;
        expect(id).toBeGreaterThan(0);
        expect(firstname).toBe(createUserDto.firstname);
        expect(lastname).toBe(createUserDto.lastname);
        expect(email).toBe(createUserDto.email);
      });
  });

  it('/user/:id (GET)', async () => {
    const newUser = repository.create({
      firstname: 'Qui',
      lastname: 'Huynh',
      email: 'quichua333@gmail.com',
    });
    const savedUser = await repository.save(newUser);

    return request(app.getHttpServer())
      .get(`/user/${savedUser.id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toMatchObject({
          firstname: 'Qui',
          lastname: 'Huynh',
          email: 'quichua333@gmail.com',
        });
      });
  });
});
