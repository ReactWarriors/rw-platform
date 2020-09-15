import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { CreateUserDto, IUser, LoginUserDto, UserRO } from './user.type';

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
    const { username } = data;
    const isUserAlreadyExist = Boolean(await this.findUserByName(username));
    if (isUserAlreadyExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersRepository.create(data);
    await this.usersRepository.save(user);
    return user;
  }

  private findUserByName(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }
}
