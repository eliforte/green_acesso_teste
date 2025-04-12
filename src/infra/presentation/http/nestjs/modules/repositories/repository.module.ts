import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BoletoRepository, LoteRepository } from '@/infra/persistence/database/prisma/repositories';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: 'BoletoRepositoryPort',
      useClass: BoletoRepository,
    },
    {
      provide: 'LoteRepositoryPort',
      useClass: LoteRepository,
    },
    LoteRepository,
  ],
  exports: [LoteRepository, 'LoteRepositoryPort', 'BoletoRepositoryPort'],
})
export class RepositoryModule {}