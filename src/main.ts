import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as hbs from 'hbs';
import * as sassMiddleware from 'node-sass-middleware';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';


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

  const microservice = app.connectMicroservice(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.CLOUDAMQP_URL],
        queue: 'project_acces',
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
