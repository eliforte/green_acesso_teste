import { Test } from '@nestjs/testing';
import { ListBoletosUseCase } from '@/core/application/use-cases';
import { BoletoEntity } from '@/core/domain/entities/boleto.entity';
import { BoletoRepositoryPort } from '@/core/ports/repositories';

describe('ListBoletosUseCase', () => {
  let useCase: ListBoletosUseCase;
  let mockBoletoRepository: Partial<BoletoRepositoryPort>;

  beforeEach(async () => {
    mockBoletoRepository = {
      findAll: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ListBoletosUseCase,
        {
          provide: 'BoletoRepositoryPort',
          useValue: mockBoletoRepository,
        },
      ],
    }).compile();

    useCase = moduleRef.get<ListBoletosUseCase>(ListBoletosUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return boletos list from repository', async () => {
      const mockFilter = { 
        nome: 'José', 
        valor_inicial: 100, 
        valor_final: 200 
      };
      
      const mockBoletos: BoletoEntity[] = [
        new BoletoEntity(
          {
            id: 1,
            nome_sacado: 'JOSE DA SILVA',
            id_lote: 3,
            valor: 182.54,
            linha_digitavel: '123456123456123456',
            ativo: true,
            criado_em: new Date('2023-01-01')
          }
        )
      ];
      
      mockBoletoRepository.findAll = jest.fn().mockResolvedValue(mockBoletos);

      const result = await useCase.execute(mockFilter);

      expect(mockBoletoRepository.findAll).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual(mockBoletos);
    });

    it('should handle empty results from repository', async () => {
      const mockFilter = { nome: 'Nome inexistente' };
      mockBoletoRepository.findAll = jest.fn().mockResolvedValue([]);

      const result = await useCase.execute(mockFilter);
      
      expect(mockBoletoRepository.findAll).toHaveBeenCalledWith(mockFilter);
      expect(result).toEqual([]);
    });

    it('should propagate errors from repository', async () => {
      const mockFilter = { nome: 'Teste' };
      const mockError = new Error('Erro no banco de dados');
      
      mockBoletoRepository.findAll = jest.fn().mockRejectedValue(mockError);

      await expect(useCase.execute(mockFilter)).rejects.toThrow(
        `Falha ao listar boletos: ${mockError.message}`
      );
    });
  });
});