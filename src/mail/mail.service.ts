import { Inject, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ISendEmailData } from './interfaces/sendEmailData.interface';

const logger = new Logger('MailService');

@Injectable()
export class MailService {
  constructor(@Inject('MAILER_CONNECTION') private readonly transport) {
  }

  async send(data: ISendEmailData) {
    try {
      const info = await this.transport.sendMail(data);
      logger.log(`${data.subject} email was send to: ${data.to}`)

      logger.log('Message sent: %s', info.messageId);

      if (process.env.NODE_ENV === 'development' && !process.env.DEBUG_MAILER) {
        logger.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (e) {
      logger.error(e)
    }
  }
}
