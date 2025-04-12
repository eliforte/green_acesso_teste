import { BoletoRepositoryPort } from '@/core/ports/repositories';
import { BoletoEntity } from '../../domain/entities/boleto.entity';
import { FileInfo, FileServicePort, PdfProcessorPort } from '@/core/ports/services';

class ProcessPdfUseCase {
  constructor(
    private readonly boletoRepository: BoletoRepositoryPort,
    private readonly pdfProcessor: PdfProcessorPort,
    private readonly fileService: FileServicePort
  ) {}

  public async execute(pdfBuffer: Buffer, outputDir: string, originalFile?: Express.Multer.File): Promise<string[]> {
    try {
      const boletos = await this.boletoRepository.findAll();
      
      if (!boletos.length) {
        throw new Error('Nenhum boleto encontrado para processamento');
      }
      
      const pages = await this.pdfProcessor.splitPages(pdfBuffer);
      await this.fileService.ensureDirectory(outputDir);
      const pageMapping = this.createBoletoPageMapping(boletos, pages);
      const outputFiles: string[] = [];
      
      for (const [boletoId, page] of Object.entries(pageMapping)) {
        const fileInfo: FileInfo = {
          filename: `${boletoId}.pdf`,
          mimetype: 'application/pdf',
          size: page.content.length,
          buffer: page.content,
        };
        
        const result = await this.fileService.saveFile(fileInfo, outputDir);
        outputFiles.push(result.path);
      }
      
      if (originalFile) {
        const fileInfo: FileInfo = {
          filename: `import_${Date.now()}_${originalFile.originalname}`,
          mimetype: originalFile.mimetype,
          size: originalFile.size,
          buffer: pdfBuffer,
        };
        
        await this.fileService.ensureDirectory('./storage/pdf');
        await this.fileService.saveFile(fileInfo, './storage/pdf');
      }
      
      return outputFiles;
    } catch (error) {
      throw new Error(`Falha ao processar PDF: ${error.message}`);
    }
  }

  private createBoletoPageMapping(boletos: BoletoEntity[], pages: any[]): Record<number, any> {
    const mapping: Record<number, any> = {};
    const validBoletos = boletos.filter(boleto => boleto.id);
    const sortedBoletos = validBoletos.sort((a, b) => a.id! - b.id!);
    
    sortedBoletos.forEach((boleto, index) => {
      if (index < pages.length) {
        mapping[boleto.id!] = pages[index];
      }
    });
    
    return mapping;
  }
}

export { ProcessPdfUseCase };
