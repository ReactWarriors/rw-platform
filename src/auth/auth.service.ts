import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { PaymentService } from '../payment/payment.service';

import { ISendConfirmationRO } from './interfaces/send-сonfirmation.ro.interface';
import { CreateUserDto, IUser, LoginUserDto, UserRO } from '../user/user.type';
import { UserStatus } from '../user/enums/status.enum';
import { EmailSubject } from '../mail/enums/emailSubject.enum';
import { decodeToken } from '../shared/verifyToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly paymentService: PaymentService,
  ) {}

  async login(data: LoginUserDto): Promise<UserRO> {
    const user = await this.userService.login(data);
    return this.addTokenToUser(user);
  }

  async signUp(
    data: CreateUserDto,
    payedRegisterToken?: string,
  ): Promise<UserRO> {
    let payedRegisterTokenData;

    if (payedRegisterToken) {
      payedRegisterTokenData = await this.paymentService.findPayedRegisterTokenDataByToken(payedRegisterToken)

      if (!payedRegisterTokenData) {
        throw new HttpException(
          'Invalid payed register token',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const user = await this.userService.create(data);

    if (payedRegisterTokenData) {
      await this.paymentService.addPayedRegisterProjectAccess(
        user.id,
        payedRegisterTokenData,
      );
    }

    await this.sendConfirmation(user);
    return this.addTokenToUser(user);
  }

  async sendConfirmation(user: IUser): Promise<ISendConfirmationRO> {
    const confirmationToken = await this.signUser(user);
    const confirmLink = `${process.env.HOST}/auth/confirm?token=${confirmationToken}`;

    try {
      await this.mailService.send({
        from: 'mail@reactwarriors.com',
        to: user.email,
        subject: EmailSubject.accountConfirmation,
        text: 'Welcome to RW platform ! Confirm account',
        html: `<div><b>Welcome to RW platform !</b><br/><a href="${confirmLink}">Confirm account !</a></div>`,
      });
      return {
        ok: true,
        result: {
          message: `Email was send to ${user.email}`,
        },
      };
    } catch {
      return {
        ok: false,
      };
    }
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
