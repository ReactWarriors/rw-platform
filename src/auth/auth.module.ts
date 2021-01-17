import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { MailService } from '../mail/mail.service';
import { MailModule } from '../mail/mail.module';
import { PayedRegisterToken } from '../payment/payed_register_token.entity';
import { PaymentService } from '../payment/payment.service';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    UserModule,
    MailModule,
    TypeOrmModule.forFeature([UserEntity, PayedRegisterToken]),
    PaymentModule,
  ],
  providers: [AuthService, UserService, MailService, PaymentService],
  controllers: [AuthController],
})
export class AuthModule {}
