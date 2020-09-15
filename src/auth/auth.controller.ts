import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from '../user/user.dto';
import { UserService } from '../user/user.service';

@Controller('')
export class AuthController {
  constructor(private readonly usersService: UserService) {}

  @Post('/register')
  registerUser(@Body() data: UserDto) {
    return this.usersService.registerUser(data);
  }

  @Post('/login')
  login(@Body() data: UserDto) {
    return this.usersService.login(data);
  }
}
