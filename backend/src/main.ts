import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './dns-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (Postman, curl, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = [
        'http://localhost:3000',
        'https://ablespace-task-management-seven.vercel.app',
      ];

      // Allow the official frontend and Vercel preview deployments
      const isVercelDeployment =
        /^https:\/\/ablespace-task-management-[a-z0-9-]+-tapas-projects1\.vercel\.app$/.test(
          origin,
        );

      if (
        allowedOrigins.includes(origin) ||
        isVercelDeployment
      ) {
        return callback(null, true);
      }

      return callback(
        new Error('Not allowed by CORS'),
        false,
      );
    },

    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 5000);
}

bootstrap();