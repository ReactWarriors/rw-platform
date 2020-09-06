import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

import 'dotenv/config';
import { join } from 'path';
import { AppModule } from './app.module';


const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const microservice = app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.CLOUDAMQP_URL],
        queue: 'projects_access',
        queueOptions: {
          durable: false
        },
      }
    },
  );

  microservice.listen(() => logger.log('Microservice is listening... '));
  await app.listen(process.env.PORT, () => {
    logger.log(`Platform is running on port ${process.env.PORT}`);
  });
}

bootstrap();
