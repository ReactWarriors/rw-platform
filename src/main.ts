import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import * as helmet from 'helmet';
import { join } from 'path';

import { AppModule } from './app.module';
import { initMailer } from './mail/mail.service';

const logger = new Logger();

export let mailTransport;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors();

  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.CLOUDAMQP_URL],
      queue: 'projects_access',
      queueOptions: {
        durable: false,
      },
    },
  });

  mailTransport = await initMailer();
  await microservice.listen(() => logger.log('Microservice is listening... '));
  await app.listen(process.env.PORT, () => {
    logger.log(`Platform is running on port ${process.env.PORT}`);
  });
}

bootstrap();
