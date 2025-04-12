import { ProcessPdfUseCase } from './process-pdf.use-case';
import { BoletoEntity } from '../../domain/entities/boleto.entity';
import { PdfPageInfo } from '../../../core/ports/services';

describe('ProcessPdfUseCase', () => {
  let useCase: ProcessPdfUseCase;
  let mockBoletoRepository: any;
  let mockPdfProcessor: any;
  let mockFileService: any;

  const mockPdfBuffer = Buffer.from('mock pdf content');
  const outputDir = './storage/boletos';
  
  const mockBoletos: BoletoEntity[] = [
    new BoletoEntity({
      id: 1,
      nome_sacado: 'JOSE DA SILVA',
      id_lote: 3,
      valor: 182.54,
      linha_digitavel: '123456123456123456'
    }),
    new BoletoEntity({
      id: 2,
      nome_sacado: 'MARCOS ROBERTO',
      id_lote: 6,
      valor: 178.20,
      linha_digitavel: '123456123456123456'
    }),
    new BoletoEntity({
      id: 3,
      nome_sacado: 'MARCIA CARVALHO',
      id_lote: 7,
      valor: 128.00,
      linha_digitavel: '123456123456123456'
    })
  ];

  const mockPdfPages: PdfPageInfo[] = [
    { pageNumber: 1, content: Buffer.from('page 1') },
    { pageNumber: 2, content: Buffer.from('page 2') },
    { pageNumber: 3, content: Buffer.from('page 3') }
  ];

  const mockFile = {
    originalname: 'boletos.pdf',
    mimetype: 'application/pdf',
    size: 1024,
    buffer: mockPdfBuffer
  } as Express.Multer.File;

  beforeEach(() => {
    mockBoletoRepository = {
      findAll: jest.fn().mockResolvedValue(mockBoletos)
    };

    mockPdfProcessor = {
      splitPages: jest.fn().mockResolvedValue(mockPdfPages)
    };

    mockFileService = {
      ensureDirectory: jest.fn().mockResolvedValue(undefined),
      saveFile: jest.fn().mockImplementation((fileInfo) => {
        return Promise.resolve({
          path: `${outputDir}/${fileInfo.filename}`,
          filename: fileInfo.filename,
          size: fileInfo.size
        });
      })
    };

    useCase = new ProcessPdfUseCase(
      mockBoletoRepository,
      mockPdfProcessor,
      mockFileService
    );
  });

  it('should successfully process PDF and map pages to boletos', async () => {
    const result = await useCase.execute(mockPdfBuffer, outputDir);

    expect(mockBoletoRepository.findAll).toHaveBeenCalled();
    expect(mockPdfProcessor.splitPages).toHaveBeenCalledWith(mockPdfBuffer);
    expect(mockFileService.ensureDirectory).toHaveBeenCalledWith(outputDir);
    expect(mockFileService.saveFile).toHaveBeenCalledTimes(3);
    
    expect(result).toEqual([
      `${outputDir}/1.pdf`,
      `${outputDir}/2.pdf`,
      `${outputDir}/3.pdf`,
    ]);
  });

  it('should save original file when provided', async () => {
    await useCase.execute(mockPdfBuffer, outputDir, mockFile);

    expect(mockFileService.ensureDirectory).toHaveBeenCalledWith('./storage/pdf');
    expect(mockFileService.saveFile).toHaveBeenCalledWith(
      expect.objectContaining({
        mimetype: 'application/pdf',
        buffer: mockPdfBuffer
      }),
      './storage/pdf'
    );
  });

  it('should throw error when no boletos found', async () => {
    mockBoletoRepository.findAll.mockResolvedValue([]);

    await expect(useCase.execute(mockPdfBuffer, outputDir)).rejects.toThrow(
      'Falha ao processar PDF: Nenhum boleto encontrado para processamento'
    );
  });

  it('should throw error when PDF processing fails', async () => {
    mockPdfProcessor.splitPages.mockRejectedValue(new Error('Invalid PDF format'));

    await expect(useCase.execute(mockPdfBuffer, outputDir)).rejects.toThrow(
      'Falha ao processar PDF: Invalid PDF format'
    );
  });

  it('should throw error when saving files fails', async () => {
    mockFileService.saveFile.mockRejectedValue(new Error('File system error'));

    await expect(useCase.execute(mockPdfBuffer, outputDir)).rejects.toThrow(
      'Falha ao processar PDF: File system error'
    );
  });
});
