import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⭐ REQUIRED ⭐
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(4000);
  //console.log('Server running on http://localhost:4000');
}

bootstrap();
