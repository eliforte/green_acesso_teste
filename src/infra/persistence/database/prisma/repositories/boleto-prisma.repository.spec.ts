import { PrismaService } from '../connection';
import { Test, TestingModule } from '@nestjs/testing';
import { BoletoRepository } from './boleto-prisma.repository';
import { BoletoEntity } from '../../../../../core/domain/entities';
import { BoletoFilter } from '@/core/ports/repositories';

describe('BoletoRepository', () => {
  let repository: BoletoRepository;
  let prismaService: PrismaService;

  const mockBoletoPrisma = {
    id: 1,
    nome_sacado: 'JOSE DA SILVA',
    id_lote: 3,
    valor: 182.54,
    linha_digitavel: '123456123456123456',
    ativo: true,
    criado_em: new Date('2023-01-01')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoletoRepository,
        {
          provide: PrismaService,
          useValue: {
            boleto: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn()
            },
            $transaction: jest.fn()
          }
        }
      ],
    }).compile();

    repository = module.get<BoletoRepository>(BoletoRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return all boletos without filters', async () => {
      jest.spyOn(prismaService.boleto, 'findMany').mockResolvedValue([mockBoletoPrisma]);

      const result = await repository.findAll();

      expect(prismaService.boleto.findMany).toHaveBeenCalledWith({
        where: { ativo: true },
        include: { lote: true }
      });
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(BoletoEntity);
      expect(result[0].id).toBe(1);
    });

    it('should apply filters when provided', async () => {
      jest.spyOn(prismaService.boleto, 'findMany').mockResolvedValue([mockBoletoPrisma]);

      const filter: BoletoFilter = {
        nome: 'JOSE',
        valor_inicial: 100,
        valor_final: 200,
        id_lote: 3
      };

      await repository.findAll(filter);

      expect(prismaService.boleto.findMany).toHaveBeenCalledWith({
        where: {
          ativo: true,
          nome_sacado: {
            contains: 'JOSE',
            mode: 'insensitive'
          },
          id_lote: 3,
          valor: {
            gte: 100,
            lte: 200
          }
        },
        include: { lote: true }
      });
    });
  });

  describe('findById', () => {
    it('should return boleto when found', async () => {
      jest.spyOn(prismaService.boleto, 'findUnique').mockResolvedValue(mockBoletoPrisma);

      const result = await repository.findById(1);

      expect(prismaService.boleto.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
          ativo: true
        }
      });
      
      expect(result).toBeInstanceOf(BoletoEntity);
      expect(result?.id).toBe(1);
    });

    it('should return null when boleto not found', async () => {
      jest.spyOn(prismaService.boleto, 'findUnique').mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should create new boleto when id is not provided', async () => {
      const newBoleto = new BoletoEntity({
        nome_sacado: 'JOSE DA SILVA',
        id_lote: 3,
        valor: 182.54,
        linha_digitavel: '123456123456123456'
      });

      jest.spyOn(prismaService.boleto, 'create').mockResolvedValue(mockBoletoPrisma);

      const result = await repository.save(newBoleto);

      expect(prismaService.boleto.create).toHaveBeenCalledWith({
        data: {
          nome_sacado: 'JOSE DA SILVA',
          id_lote: 3,
          valor: 182.54,
          linha_digitavel: '123456123456123456',
          ativo: true
        }
      });
      
      expect(result).toBeInstanceOf(BoletoEntity);
      expect(result.id).toBe(1);
    });

    it('should update existing boleto when id is provided', async () => {
      const existingBoleto = new BoletoEntity({
        id: 1,
        nome_sacado: 'JOSE DA SILVA',
        id_lote: 3,
        valor: 200,
        linha_digitavel: '123456123456123456'
      });

      const mockUpdatedBoleto = {
        ...mockBoletoPrisma,
        valor: 200
      };

      jest.spyOn(prismaService.boleto, 'update').mockResolvedValue(mockUpdatedBoleto);

      const result = await repository.save(existingBoleto);

      expect(prismaService.boleto.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          nome_sacado: 'JOSE DA SILVA',
          id_lote: 3,
          valor: 200,
          linha_digitavel: '123456123456123456',
          ativo: true
        }
      });
      
      expect(result).toBeInstanceOf(BoletoEntity);
      expect(result.id).toBe(1);
      expect(result.valor).toBe(200);
    });
  });

  describe('saveMany', () => {
    it('should save multiple boletos in a transaction', async () => {
      const mockBoletos = [
        new BoletoEntity({
          nome_sacado: 'JOSE DA SILVA',
          id_lote: 3,
          valor: 182.54,
          linha_digitavel: '123456123456123456'
        }),
        new BoletoEntity({
          nome_sacado: 'MARIA OLIVEIRA',
          id_lote: 5,
          valor: 256.87,
          linha_digitavel: '987654987654987654'
        })
      ];

      (prismaService.$transaction as jest.Mock).mockImplementation(async (callback) => {
        const tx = {
          boleto: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockImplementation((params) => {
              return {
                id: Math.floor(Math.random() * 1000),
                ...params.data,
                criado_em: new Date()
              };
            })
          }
        };
        
        return await callback(tx);
      });
    
      const result = await repository.saveMany(mockBoletos);
    
      expect(prismaService.$transaction).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(BoletoEntity);
    });
  });
});