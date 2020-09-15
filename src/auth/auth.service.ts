import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto, IUser, LoginUserDto, UserRO } from '../user/user.type';
import { UserService } from '../user/user.service';
import { verifyToken } from '../shared/verifyToken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async login(data: LoginUserDto): Promise<UserRO> {
    const user = await this.userService.login(data);
    return this.addTokenToUser(user);
  }

  async signUp(data: CreateUserDto): Promise<UserRO> {
    const user = await this.userService.create(data);
    await this.sendConfirmation(user);
    return this.addTokenToUser(user);
  }

  async sendConfirmation(user: IUser) {
    const confirmationToken = await this.signUser(user);
    // todo: update confirmation link
    const confirmLink = `http://localhost:${process.env.PORT}/auth/confirm?token=${confirmationToken}`;

    console.log("confirmation Link ->", confirmLink)

    return confirmLink;
    // await this.mailService.send({
    //   from: this.configService.get<string>('JS_CODE_MAIL'),
    //   to: user.email,
    //   subject: 'Verify User',
    //   html: `
    //             <h3>Hello ${user.firstName}!</h3>
    //             <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p>
    //         `,
    // });
  }

  async confirm(token: string) {
    return verifyToken(token)
  }

  async signUser(user: IUser): Promise<string> {
    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return await this.generateToken(tokenPayload);
  }

  private async generateToken(data: any): Promise<string> {
    return jwt.sign(data, process.env.SECRET, { expiresIn: '7d' });
  }

  private async addTokenToUser(user: IUser): Promise<UserRO> {
    const { id, created, username, projectsApiKeys } = user;
    const token = await this.signUser(user);

    const responseObject: UserRO = {
      id,
      created,
      username,
      projectsApiKeys,
      token,
    };

    return responseObject;
  }
}
