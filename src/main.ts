import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as hbs from 'hbs';
import * as sassMiddleware from 'node-sass-middleware';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const PORT = process.env.PORT || 4000;
const MICROSERVICE_PORT = process.env.MICROSERVICE_PORT || 8877;
const HOST = process.env.HOST || '127.0.0.1';

const MICROSERVICE_OPTIONS = {
  host: HOST,
  port: MICROSERVICE_PORT,
};

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('pug');
  hbs.registerPartials(join(__dirname, '..', 'views'));
  app.use(
    sassMiddleware({
      src: join(__dirname, '..', 'src'), //where the styles files are
      dest: join(__dirname, '..', 'public'), //where styles should go
      prefix: '',
      sourceMap: true,
      outputStyle: 'compressed',
      indentedSyntax: false,
      force: true,
      debug: true, // obvious
    }),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const microservice = app.connectMicroservice({
    transport: Transport.TCP,
  });

  microservice.listen(() => logger.log('Microservice is listening... '));
  await app.listen(PORT, () => {
    logger.log(`Platform is running on port ${PORT}`);
  });
}

bootstrap();
