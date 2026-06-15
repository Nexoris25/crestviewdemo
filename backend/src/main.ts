import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false }),
  );

  const origins = (process.env.CORS_ORIGINS ?? 'http://localhost:3003,http://localhost:3002')
    .split(',')
    .map((o) => o.trim());
  app.enableCors({ origin: origins, credentials: true });

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  Logger.log(`CrestView API listening on http://localhost:${port}/api`, 'Bootstrap');
}
void bootstrap();
