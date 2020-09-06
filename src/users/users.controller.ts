import { Body, Controller, Get, Post, Render, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserDto } from './user.dto';
import { AuthGuard } from '../shared/auth.guard';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('users')
  @UseGuards(new AuthGuard())
  getAll() {
    return this.usersService.findAll();
  }

  @Post('/register')
  registerUser(@Body() data: UserDto) {
    return this.usersService.registerUser(data);
  }

  @Post('/login')
  login(@Body() data: UserDto) {
    return this.usersService.login(data);
  }
}
