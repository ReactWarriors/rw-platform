import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { mailProviders } from './mail.provider';


@Module({
  providers: [...mailProviders, MailService],
  exports: [...mailProviders, MailService]
})
export class MailModule {}
