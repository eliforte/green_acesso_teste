
import { Module } from '@nestjs/common';
import { UseCasesModule } from '../use-cases/use-cases.module';
import { BoletoController } from './boletos/boleto.controller';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [UseCasesModule],
  controllers: [BoletoController, UploadController],
})
export class ControllersModule {}