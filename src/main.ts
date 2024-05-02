import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  ValidationFilter,
  exceptionFactory,
} from './exceptions/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: false, // If Null/Undefined Value , still validated
      transform: true, // Transform plain object to DTO Type/Classes
      exceptionFactory,
    }),
  );
  await app.listen(3000);
}
bootstrap();
