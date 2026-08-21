import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './dns-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration for local and deployed frontend
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://ablespace-task-management-seven.vercel.app',
      'https://ablespace-task-management-4psxxirc7-tapas-projects1.vercel.app',
    ],
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Start server
  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();