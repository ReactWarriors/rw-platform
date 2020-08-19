import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as hbs from 'hbs';
import * as sassMiddleware from 'node-sass-middleware';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

const PORT = 4000;
const MICROSERVICE_PORT = 8877;

async function bootstrap() {
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.setViewEngine('pug');
  // hbs.registerPartials(join(__dirname, '..', 'views'));
  // app.use(
  //   sassMiddleware({
  //     src: join(__dirname, '..', 'src'), //where the styles files are
  //     dest: join(__dirname, '..', 'public'), //where styles should go
  //     prefix: '',
  //     sourceMap: true,
  //     outputStyle: 'compressed',
  //     indentedSyntax: false,
  //     force: true,
  //     debug: true, // obvious
  //   }),
  // );
  // app.useStaticAssets(join(__dirname, '..', 'public'));

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: MICROSERVICE_PORT,
      },
    },
  );
  app.listen(() => console.log('Microservice is listening'));

  // const microservice = app.connectMicroservice({
  //   transport: Transport.TCP,
  //   port: MICROSERVICE_PORT,
  // });
  //
  // microservice.listen(() =>
  //   console.log(`Microservice is listening port ${MICROSERVICE_PORT} ...`),
  // );
  // await app.listen(PORT, () => {
  //   console.log(`rw-platform is running on port ${PORT}`);
  // });
}

bootstrap();
