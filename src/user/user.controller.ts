import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './user.type';
import { AuthGuard } from '../shared/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('')
  @UseGuards(new AuthGuard())
  getAll() {
    return this.usersService.findAll();
  }
}
