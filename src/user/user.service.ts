import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { CreateUserDto, IUser, LoginUserDto, UserRO } from './user.type';
import { UserStatus } from './enums/status.enum';
import { UserRole } from './enums/role.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserRO[]> {
    const users = await this.usersRepository.find({
      relations: ['projectsApiKeys'],
    });

    return users.map(item => item.toResponseObject());
  }

  async login(data: LoginUserDto): Promise<IUser> {
    const { email, password } = data;
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user;
  }

  async create(data: CreateUserDto): Promise<IUser> {
    const { email } = data;
    const isUserAlreadyExist =
      Boolean(await this.findByEmail(email)) ||
      Boolean(await this.findByUsername(email));
    if (isUserAlreadyExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersRepository.create(data);
    await this.usersRepository.save(user);
    return user;
  }

  async find(id: string): Promise<IUser> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<IUser> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<IUser> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(updatedUser: IUser): Promise<IUser> {
    await this.usersRepository.save(updatedUser);
    return updatedUser;
  }

  async updateStatus(user: IUser, status: UserStatus) {
    return this.update({ ...user, status });
  }

  async updateRole(user: IUser, role: UserRole) {
    return this.update({ ...user, role });
  }
}
