import { BoletoRepositoryPort } from '@/core/ports/repositories';
import { BoletoEntity } from '../../domain/entities/boleto.entity';
import { CsvProcessorPort, FileInfo, FileServicePort } from '@/core/ports/services';

class ImportCsvUseCase {
  constructor(
    private readonly boletoRepository: BoletoRepositoryPort,
    private readonly csvProcessor: CsvProcessorPort,
    private readonly fileService: FileServicePort
  ) {}

  async execute(content: string, originalFile?: Express.Multer.File): Promise<BoletoEntity[]> {
    try {
      const records = await this.csvProcessor.parseContent(content);
      const boletos = await this.csvProcessor.mapToBoletos(records);
      const savedBoletos = await this.boletoRepository.saveMany(boletos);
      
      if (originalFile) {
        const fileInfo: FileInfo = {
          filename: `import_${Date.now()}_${originalFile.originalname}`,
          mimetype: originalFile.mimetype,
          size: originalFile.size,
          buffer: Buffer.from(content),
        };
        
        await this.fileService.ensureDirectory('./storage/csv');
        await this.fileService.saveFile(fileInfo, './storage/csv');
      }
      
      return savedBoletos;
    } catch (error) {
      throw new Error(`Falha ao importar CSV: ${error.message}`);
    }
  }
}

export { ImportCsvUseCase };