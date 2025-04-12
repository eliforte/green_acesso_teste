import { Module } from '@nestjs/common';
import { RepositoryModule } from '../repositories/repository.module';
import { AdaptersModule } from '../adapters/adapters.module';
import { ImportCsvUseCase } from '@/core/application/use-cases/import-csv.use-case';
import { ProcessPdfUseCase } from '@/core/application/use-cases/process-pdf.use-case';
import { GenerateReportUseCase } from '@/core/application/use-cases/generate-report.use-case';
import { ListBoletosUseCase } from '@/core/application/use-cases/list-boletos.use-case';

@Module({
  imports: [RepositoryModule, AdaptersModule],
  providers: [
    {
      provide: ImportCsvUseCase,
      useFactory: (boletoRepo, csvProcessor, fileService) => 
        new ImportCsvUseCase(boletoRepo, csvProcessor, fileService),
      inject: ['BoletoRepositoryPort', 'CsvProcessorPort', 'FileServicePort'],
    },
    {
      provide: ProcessPdfUseCase,
      useFactory: (boletoRepo, pdfProcessor, fileService) => 
        new ProcessPdfUseCase(boletoRepo, pdfProcessor, fileService),
      inject: ['BoletoRepositoryPort', 'PdfProcessorPort', 'FileServicePort'],
    },
    {
      provide: GenerateReportUseCase,
      useFactory: (boletoRepo, pdfProcessor) => 
        new GenerateReportUseCase(boletoRepo, pdfProcessor),
      inject: ['BoletoRepositoryPort', 'PdfProcessorPort'],
    },
    {
      provide: ListBoletosUseCase,
      useFactory: (boletoRepo) => {
        return new ListBoletosUseCase(boletoRepo);
      },
      inject: ['BoletoRepositoryPort']
    }
  ],
  exports: [ImportCsvUseCase, ProcessPdfUseCase, GenerateReportUseCase, ListBoletosUseCase],
})
export class UseCasesModule {}