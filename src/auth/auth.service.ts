import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto, IUser, LoginUserDto, UserRO } from '../user/user.type';
import { UserService } from '../user/user.service';
import { decodeToken } from '../shared/verifyToken';
import { UserStatus } from '../user/enums/status.enum';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

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
    const confirmLink = `http://localhost:${process.env.PORT}/auth/confirm?token=${confirmationToken}`;
    await this.mailService.send(confirmLink);
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
    const { payload } = await decodeToken(token);
    const user: IUser = await this.userService.find(payload.id);

    if (!user) {
      throw new HttpException(`User doesn't exist`, HttpStatus.FORBIDDEN);
    }

    if (user && user.status === UserStatus.pending) {
      await this.userService.updateStatus(user, UserStatus.active);
      return {
        message: 'Account was successfully confirmed',
      };
    }

    if (user && user.status === UserStatus.blocked) {
      throw new HttpException(
        `User was blocked can't can't be confirmed`,
        HttpStatus.FORBIDDEN,
      );
    }

    if (user && user.status === UserStatus.active) {
      throw new HttpException(
        `User was already confirmed`,
        HttpStatus.FORBIDDEN,
      );
    }
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
    const { id, created, username, email, projectsApiKeys } = user;
    const token = await this.signUser(user);

    return {
      id,
      created,
      username,
      email,
      projectsApiKeys,
      token,
    };
  }
}
