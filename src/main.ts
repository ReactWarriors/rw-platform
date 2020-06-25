import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as hbs from 'hbs';
import * as sassMiddleware from 'node-sass-middleware';

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
  await app.listen(4000);
}

bootstrap();
