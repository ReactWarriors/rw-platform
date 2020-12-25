import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ISendEmailData } from './interfaces/sendEmailData.interface';

@Injectable()
export class MailService {
  logger: Logger;

  constructor(@Inject('MAILER_CONNECTION') private readonly transport) {
    this.logger = new Logger('MailService');
  }

  async send(data: ISendEmailData) {
    try {
      const info = await this.transport.sendMail(data);
      this.logger.log(`${data.subject} email was send to: ${data.to}`);

      if (process.env.NODE_ENV === 'development' && !process.env.DEBUG_MAILER) {
        this.logger.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
