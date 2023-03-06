import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT;

  await app.listen(port).then(() => {
    console.log('Server is running on port: ' + port + '...');
  });
}

void bootstrap();
