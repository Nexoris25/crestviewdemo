import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import type { Server } from 'http';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false }),
  );

  // CORS allow-list comes only from the environment (no hard-coded origins).
  const origins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  if (origins.length === 0) {
    Logger.warn(
      'CORS_ORIGINS is not set — cross-origin browser requests will be blocked.',
      'Bootstrap',
    );
  }
  app.enableCors({ origin: origins, credentials: true });

  // Keep idle keep-alive connections open longer than the typical reverse proxy
  // (Nginx defaults to ~60s). Node's default of 5s lets the proxy reuse a
  // connection Node has already closed, which makes the first request after a
  // quiet period fail. These timeouts prevent that, so the app stays responsive
  // without needing a hard refresh.
  const server = app.getHttpServer() as Server;
  server.keepAliveTimeout = 65_000;
  server.headersTimeout = 66_000;

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  Logger.log(`CrestView API listening on port ${port} (prefix: /api)`, 'Bootstrap');
}
void bootstrap();
