import * as nodemailer from 'nodemailer';

export const mailProviders = [
  {
    provide: 'MAILER_CONNECTION',
    useFactory: async () => {
      if (process.env.NODE_ENV === 'production' || process.env.DEBUG_MAILER) {
        console.log('for prod');
        return nodemailer.createTransport({
          host: process.env.SMPTP_SERVER,
          port: process.env.SMTP_PASSWORD,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      }

      // for local development
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    },
  },
];
