import { LoteRepositoryPort } from '@/core/ports/repositories';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../connection';
import { LoteEntity } from '@/core/domain/entities';

@Injectable()
class LoteRepository implements LoteRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  public async findByNome(nome: string): Promise<LoteEntity | null> {
    const lote = await this.prisma.lote.findFirst({
      where: {
        nome,
        ativo: true,
      },
    });

    if (!lote) {
      return null;
    }

    return new LoteEntity({
      id: lote.id,
      nome: lote.nome,
      ativo: lote.ativo,
      criado_em: lote.criado_em,
    });
  }

  public async findAll(): Promise<LoteEntity[]> {
    const lotes = await this.prisma.lote.findMany({
      where: {
        ativo: true,
      },
    });

    return lotes.map(
      (lote) =>
        new LoteEntity({
          id: lote.id,
          nome: lote.nome,
          ativo: lote.ativo,
          criado_em: lote.criado_em,
        }),
    );
  }

  async findById(id: number): Promise<LoteEntity | null> {
    const lote = await this.prisma.lote.findUnique({
      where: {
        id,
        ativo: true,
      },
    });

    if (!lote) {
      return null;
    }

    return new LoteEntity({
      id: lote.id,
      nome: lote.nome,
      ativo: lote.ativo,
      criado_em: lote.criado_em,
    });
  }

  public async save(lote: LoteEntity): Promise<LoteEntity> {
    const { id, ...data } = {
      id: lote.id,
      nome: lote.nome,
      ativo: lote.ativo,
    };

    if (id) {
      const updatedLote = await this.prisma.lote.update({
        where: { id },
        data,
      });

      return new LoteEntity({
        id: updatedLote.id,
        nome: updatedLote.nome,
        ativo: updatedLote.ativo,
        criado_em: updatedLote.criado_em,
      });
    }

    const newLote = await this.prisma.lote.create({
      data,
    });

    return new LoteEntity({
      id: newLote.id,
      nome: newLote.nome,
      ativo: newLote.ativo,
      criado_em: newLote.criado_em,
    });
  }
}

export { LoteRepository };
