import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SWAPI NestJS API')
    .setDescription('Star Wars API built with NestJS and TypeORM')
    .setVersion('1.0.0')
    .addTag('seed', 'Film management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`API documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
