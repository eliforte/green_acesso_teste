import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repositories/repository.module';
import { CsvProcessorAdapter, FileServiceAdapter, PdfProcessorAdapter } from '@/infra/presentation/http/nestjs/adapters';
import { LoteRepository } from '@/infra/persistence/database/prisma/repositories';

@Module({
  imports: [RepositoryModule],
  providers: [
    {
      provide: 'CsvProcessorPort',
      useFactory: (loteRepository: LoteRepository) => {
        return new CsvProcessorAdapter(loteRepository);
      },
      inject: [LoteRepository],
    },
    {
      provide: 'PdfProcessorPort',
      useClass: PdfProcessorAdapter,
    },
    {
      provide: 'FileServicePort',
      useClass: FileServiceAdapter,
    },
  ],
  exports: ['CsvProcessorPort', 'PdfProcessorPort', 'FileServicePort'],
})
export class AdaptersModule {}