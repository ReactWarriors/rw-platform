import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { UserDto, UserRO } from './user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async login(data: UserDto): Promise<UserRO> {
    const { username, password } = data;
    const user = await this.usersRepository.findOne({
      where: { username },
    });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username/password',
        HttpStatus.BAD_REQUEST,
      );
    }
    return user.toResponseObject();
  }

  async registerUser(data: UserDto): Promise<UserRO> {
    const { username } = data;
    const isUserAlreadyExist = Boolean(await this.findUserByName(username));
    if (isUserAlreadyExist) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersRepository.create(data);
    await this.usersRepository.save(user);
    return user.toResponseObject();
  }

  private findUserByName(username: string) {
    return this.usersRepository.findOne({ where: { username } });
  }
}
