import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global con DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // Elimina campos no definidos en el DTO
    forbidNonWhitelisted: false, // Permitir campos extra (se ignorarán)
    transform: true,       // Transforma tipos automáticamente
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // CORS restringido: solo orígenes permitidos
  const allowedOrigins = [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:4173',  // Vite preview
  ];
  if (process.env.CORS_ORIGIN) {
    allowedOrigins.push(process.env.CORS_ORIGIN);
  }
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
