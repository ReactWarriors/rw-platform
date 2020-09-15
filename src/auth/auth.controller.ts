import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserDto, UserRO } from '../user/user.type';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/register')
  registerUser(@Body() data: CreateUserDto): Promise<UserRO> {
    return this.authService.signUp(data);
  }

  @Post('/login')
  login(@Body() data: CreateUserDto) {
    return this.authService.login(data);
  }

  @Get('/confirm')
  confirm(@Query('token') token) {
    console.log('token =>', token);
    return this.authService.confirm(token);
  }
}
