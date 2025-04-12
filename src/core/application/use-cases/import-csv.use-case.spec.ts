import { ImportCsvUseCase } from './import-csv.use-case';
import { BoletoEntity } from '../../domain/entities/boleto.entity';
import { CsvRecord } from '@/core/ports/services';

describe('ImportCsvUseCase', () => {
  let useCase: ImportCsvUseCase;
  let mockBoletoRepository: any;
  let mockCsvProcessor: any;
  let mockFileService: any;

  const mockCsvContent = 'nome;unidade;valor;linha_digitavel\nJOSE DA SILVA;17;182.54;123456123456123456';
  
  const mockCsvRecords: CsvRecord[] = [
    {
      nome: 'JOSE DA SILVA',
      unidade: '17',
      valor: '182.54',
      linha_digitavel: '123456123456123456'
    }
  ];

  const mockBoletos: BoletoEntity[] = [
    new BoletoEntity({
      id: 1,
      nome_sacado: 'JOSE DA SILVA',
      id_lote: 3,
      valor: 182.54,
      linha_digitavel: '123456123456123456'
    })
  ];

  const mockFile = {
    originalname: 'boletos.csv',
    mimetype: 'text/csv',
    size: 1024,
    buffer: Buffer.from(mockCsvContent)
  } as Express.Multer.File;

  beforeEach(() => {
    mockBoletoRepository = {
      saveMany: jest.fn().mockResolvedValue(mockBoletos)
    };

    mockCsvProcessor = {
      parseContent: jest.fn().mockResolvedValue(mockCsvRecords),
      mapToBoletos: jest.fn().mockResolvedValue(mockBoletos)
    };

    mockFileService = {
      ensureDirectory: jest.fn().mockResolvedValue(undefined),
      saveFile: jest.fn().mockResolvedValue({ path: '/storage/csv/import_123_boletos.csv' })
    };

    useCase = new ImportCsvUseCase(
      mockBoletoRepository,
      mockCsvProcessor,
      mockFileService
    );
  });

  it('should successfully import CSV content', async () => {
    const result = await useCase.execute(mockCsvContent);

    expect(mockCsvProcessor.parseContent).toHaveBeenCalledWith(mockCsvContent);
    expect(mockCsvProcessor.mapToBoletos).toHaveBeenCalledWith(mockCsvRecords);
    expect(mockBoletoRepository.saveMany).toHaveBeenCalledWith(mockBoletos);
    expect(result).toEqual(mockBoletos);
  });

  it('should save original file when provided', async () => {
    const result = await useCase.execute(mockCsvContent, mockFile);

    expect(mockFileService.ensureDirectory).toHaveBeenCalledWith('./storage/csv');
    expect(mockFileService.saveFile).toHaveBeenCalled();
    expect(result).toEqual(mockBoletos);
  });

  it('should throw error when CSV processing fails', async () => {
    mockCsvProcessor.parseContent.mockRejectedValue(new Error('Invalid CSV format'));

    await expect(useCase.execute(mockCsvContent)).rejects.toThrow('Falha ao importar CSV: Invalid CSV format');
  });

  it('should throw error when boleto mapping fails', async () => {
    mockCsvProcessor.mapToBoletos.mockRejectedValue(new Error('Invalid lote reference'));

    await expect(useCase.execute(mockCsvContent)).rejects.toThrow('Falha ao importar CSV: Invalid lote reference');
  });

  it('should throw error when saving boletos fails', async () => {
    mockBoletoRepository.saveMany.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(mockCsvContent)).rejects.toThrow('Falha ao importar CSV: Database error');
  });
});