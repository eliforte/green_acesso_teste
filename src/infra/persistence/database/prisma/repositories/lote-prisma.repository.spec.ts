import { LoteEntity } from '@/core/domain/entities';
import { LoteRepository } from './lote-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../connection';

describe('LoteRepository', () => {
  let repository: LoteRepository;
  let prismaService: PrismaService;

  const mockLotePrisma = {
    id: 3,
    nome: '0017',
    ativo: true,
    criado_em: new Date('2023-01-01')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoteRepository,
        {
          provide: PrismaService,
          useValue: {
            lote: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn()
            }
          }
        }
      ],
    }).compile();

    repository = module.get<LoteRepository>(LoteRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findByNome', () => {
    it('should return lote entity when found', async () => {
      jest.spyOn(prismaService.lote, 'findFirst').mockResolvedValue(mockLotePrisma);

      const result = await repository.findByNome('0017');

      expect(prismaService.lote.findFirst).toHaveBeenCalledWith({
        where: {
          nome: '0017',
          ativo: true
        }
      });
      
      expect(result).toBeInstanceOf(LoteEntity);
      expect(result?.id).toBe(3);
      expect(result?.nome).toBe('0017');
    });

    it('should return null when lote not found', async () => {
      jest.spyOn(prismaService.lote, 'findFirst').mockResolvedValue(null);

      const result = await repository.findByNome('9999');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return array of lote entities', async () => {
      jest.spyOn(prismaService.lote, 'findMany').mockResolvedValue([mockLotePrisma]);

      const result = await repository.findAll();

      expect(prismaService.lote.findMany).toHaveBeenCalledWith({
        where: {
          ativo: true
        }
      });
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(LoteEntity);
    });
  });

  describe('findById', () => {
    it('should return lote entity when found', async () => {
      jest.spyOn(prismaService.lote, 'findUnique').mockResolvedValue(mockLotePrisma);

      const result = await repository.findById(3);

      expect(prismaService.lote.findUnique).toHaveBeenCalledWith({
        where: {
          id: 3,
          ativo: true
        }
      });
      
      expect(result).toBeInstanceOf(LoteEntity);
      expect(result?.id).toBe(3);
    });

    it('should return null when lote not found', async () => {
      jest.spyOn(prismaService.lote, 'findUnique').mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should create new lote when id is not provided', async () => {
      const newLote = new LoteEntity({
        nome: '0099',
        ativo: true
      });

      const mockCreatedLote = {
        id: 10,
        nome: '0099',
        ativo: true,
        criado_em: new Date()
      };

      jest.spyOn(prismaService.lote, 'create').mockResolvedValue(mockCreatedLote);

      const result = await repository.save(newLote);

      expect(prismaService.lote.create).toHaveBeenCalledWith({
        data: {
          nome: '0099',
          ativo: true
        }
      });
      
      expect(result).toBeInstanceOf(LoteEntity);
      expect(result.id).toBe(10);
      expect(result.nome).toBe('0099');
    });

    it('should update existing lote when id is provided', async () => {
      const existingLote = new LoteEntity({
        id: 3,
        nome: '0017',
        ativo: false
      });

      const mockUpdatedLote = {
        id: 3,
        nome: '0017',
        ativo: false,
        criado_em: new Date()
      };

      jest.spyOn(prismaService.lote, 'update').mockResolvedValue(mockUpdatedLote);

      const result = await repository.save(existingLote);

      expect(prismaService.lote.update).toHaveBeenCalledWith({
        where: { id: 3 },
        data: {
          nome: '0017',
          ativo: false
        }
      });
      
      expect(result).toBeInstanceOf(LoteEntity);
      expect(result.id).toBe(3);
      expect(result.ativo).toBe(false);
    });
  });
});