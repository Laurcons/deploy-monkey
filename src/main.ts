import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import morgan from 'morgan';
import { AppModule } from './app.module';
import { config } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });

  app.use(morgan('combined'));
  // app.use((req, res, next) => {
  //   console.log(req.headers);
  //   next();
  // });

  await app.listen(config.port);
}
bootstrap();
