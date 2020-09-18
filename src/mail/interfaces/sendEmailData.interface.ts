import { EmailSubject } from '../enums/emailSubject.enum';

export interface ISendEmailData {
  from: string;
  to: string;
  subject: EmailSubject;
  text: string;
  html: string;
}
