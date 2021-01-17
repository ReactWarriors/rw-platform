require('dotenv/config');
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { join } from 'path';

import { AppModule } from './app.module';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(helmet());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

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

  await microservice.listen(() => logger.log('Microservice is listening... '));
  await app.listen(process.env.PORT, () => {
    logger.log(`Platform is running on port ${process.env.PORT}`);
  });
}

bootstrap();
