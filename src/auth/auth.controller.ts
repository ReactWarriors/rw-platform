import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto, UserRO } from '../user/user.type';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() data: CreateUserDto): Promise<UserRO> {
    return this.authService.signUp(data);
  }

  @Post('/register/payed')
  registerPayedUser(
    @Body() data: CreateUserDto,
    @Query('token') payedRegisterToken: string,
  ): Promise<UserRO> {
    if (!payedRegisterToken) {
      throw new HttpException(
        `PayedRegisterToken is required`,
        HttpStatus.FORBIDDEN,
      );
    }

    return this.authService.signUp(data, payedRegisterToken);
  }

  @Post('/login')
  login(@Body() data: LoginUserDto) {
    return this.authService.login(data);
  }

  @Get('/confirm')
  confirm(@Query('token') token) {
    return this.authService.confirm(token);
  }
}
