import { ListBoletosUseCase } from './list-boletos.use-case';
import { BoletoEntity } from '@/core/domain/entities/boleto.entity';
import { BoletoRepositoryPort, BoletoFilter } from '../../ports/repositories';

describe('ListBoletosUseCase', () => {
  let useCase: ListBoletosUseCase;
  let mockBoletoRepository: jest.Mocked<BoletoRepositoryPort>;

  beforeEach(() => {
    mockBoletoRepository = {
      mapToDomain: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      saveMany: jest.fn()
    } as jest.Mocked<BoletoRepositoryPort>;

    useCase = new ListBoletosUseCase(mockBoletoRepository);
  });

  it('should return all boletos when no filter is provided', async () => {
    const mockBoletos: BoletoEntity[] = [
      {
        id: 1,
        nome_sacado: 'José da Silva',
        id_lote: 3,
        valor: 182.54,
        linha_digitavel: '123456123456123456',
        ativo: true,
        criado_em: new Date()
      } as BoletoEntity,
      {
        id: 2,
        nome_sacado: 'Maria Oliveira',
        id_lote: 5,
        valor: 320.75,
        linha_digitavel: '987654987654987654',
        ativo: true,
        criado_em: new Date()
      } as BoletoEntity
    ];

    mockBoletoRepository.findAll.mockResolvedValue(mockBoletos);

    // Act
    const result = await useCase.execute();

    // Assert
    expect(mockBoletoRepository.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual(mockBoletos);
    expect(result.length).toBe(2);
  });

  it('should apply filter when provided', async () => {
    // Arrange
    const filter: BoletoFilter = {
      nome: 'Silva',
      valor_inicial: 150,
      valor_final: 200
    };

    const mockBoletos: BoletoEntity[] = [
      {
        id: 1,
        nome_sacado: 'José da Silva',
        id_lote: 3,
        valor: 182.54,
        linha_digitavel: '123456123456123456',
        ativo: true,
        criado_em: new Date()
      } as BoletoEntity
    ];

    mockBoletoRepository.findAll.mockResolvedValue(mockBoletos);

    // Act
    const result = await useCase.execute(filter);

    // Assert
    expect(mockBoletoRepository.findAll).toHaveBeenCalledWith(filter);
    expect(result).toEqual(mockBoletos);
    expect(result.length).toBe(1);
  });

  it('should handle errors from repository', async () => {
    // Arrange
    mockBoletoRepository.findAll.mockRejectedValue(new Error('Database error'));

    // Act & Assert
    await expect(useCase.execute())
      .rejects
      .toThrow('Falha ao listar boletos: Database error');
    
    expect(mockBoletoRepository.findAll).toHaveBeenCalled();
  });
});