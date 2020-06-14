import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserDto } from './user.dto';
import { AuthGuard } from '../shared/auth.guard';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('api/users')
  @UseGuards(new AuthGuard())
  getAll() {
    return this.usersService.findAll();
  }

  @Get('/register')
  registerPage() {
    return 'Register page';
  }

  @Post('/register')
  registerUser(@Body() data: UserDto) {
    return this.usersService.registerUser(data);
  }

  @Post('/login')
  login(@Body() data: UserDto) {
    return this.usersService.login(data);
  }

  @Get('/login')
  renderLoginPage() {
    return 'Login page'
  }
}
