import { Env } from '@/config/env';
import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

type SwaggerConfig = Omit<OpenAPIObject, 'paths'>;

const swaggerConfig: SwaggerConfig = new DocumentBuilder()
  .setTitle('Condomínio API')
  .setDescription('API para gestão de informações de um condomínio')
  .setVersion('0.0.1')
  .addBearerAuth()
  .addServer(Env.THIS_API_URL)
  .build();

export { swaggerConfig };