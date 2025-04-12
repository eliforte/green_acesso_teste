import { GenerateReportUseCase } from './generate-report.use-case';
import { BoletoEntity } from '../../domain/entities/boleto.entity';
import { BoletoFilter } from '@/core/ports/repositories';

describe('GenerateReportUseCase', () => {
  let useCase: GenerateReportUseCase;
  let mockBoletoRepository: any;
  let mockPdfProcessor: any;

  const mockFilter: BoletoFilter = {
    nome: 'JOSE',
    valor_inicial: 100,
    valor_final: 200,
    id_lote: 3
  };

  const mockBoletos: BoletoEntity[] = [
    new BoletoEntity({
      id: 1,
      nome_sacado: 'JOSE DA SILVA',
      id_lote: 3,
      valor: 182.54,
      linha_digitavel: '123456123456123456'
    })
  ];

  const mockPdfBuffer = Buffer.from('mock pdf content');
  const mockBase64 = mockPdfBuffer.toString('base64');

  beforeEach(() => {
    mockBoletoRepository = {
      findAll: jest.fn().mockResolvedValue(mockBoletos)
    };

    mockPdfProcessor = {
      generateReport: jest.fn().mockResolvedValue(mockPdfBuffer)
    };

    useCase = new GenerateReportUseCase(
      mockBoletoRepository,
      mockPdfProcessor
    );
  });

  it('should generate report with boletos', async () => {
    const result = await useCase.execute(mockFilter);

    expect(mockBoletoRepository.findAll).toHaveBeenCalledWith(mockFilter);
    expect(mockPdfProcessor.generateReport).toHaveBeenCalledWith(
      mockBoletos,
      expect.any(Object)
    );
    
    expect(result).toEqual({
      base64: mockBase64,
      boletos: mockBoletos
    });
  });

  it('should generate report without filters', async () => {
    const result = await useCase.execute();

    expect(mockBoletoRepository.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual({
      base64: mockBase64,
      boletos: mockBoletos
    });
  });

  it('should throw error when no boletos found', async () => {
    mockBoletoRepository.findAll.mockResolvedValue([]);

    await expect(useCase.execute(mockFilter)).rejects.toThrow(
      'Falha ao gerar relatório: Nenhum boleto encontrado com os filtros especificados'
    );
  });

  it('should throw error when PDF generation fails', async () => {
    mockPdfProcessor.generateReport.mockRejectedValue(new Error('PDF generation error'));

    await expect(useCase.execute(mockFilter)).rejects.toThrow(
      'Falha ao gerar relatório: PDF generation error'
    );
  });

  it('should throw error when repository access fails', async () => {
    mockBoletoRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(useCase.execute(mockFilter)).rejects.toThrow(
      'Falha ao gerar relatório: Database error'
    );
  });
});