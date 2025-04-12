/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { BoletoEntity } from '@/core/domain/entities';
import { BoletoFilter, BoletoRepositoryPort } from '@/core/ports/repositories';
import { PrismaService } from '../connection';

@Injectable()
class BoletoRepository implements BoletoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(filter?: BoletoFilter): Promise<BoletoEntity[]> {
    const whereClause: any = {
      ativo: true,
    };

    if (filter?.nome) {
      whereClause.nome_sacado = {
        contains: filter.nome,
        mode: 'insensitive',
      };
    }

    if (filter?.id_lote) {
      whereClause.id_lote = filter.id_lote;
    }

    if (filter?.valor_inicial || filter?.valor_final) {
      whereClause.valor = {};

      if (filter.valor_inicial) {
        whereClause.valor.gte = filter.valor_inicial;
      }

      if (filter.valor_final) {
        whereClause.valor.lte = filter.valor_final;
      }
    }

    const boletos = await this.prisma.boleto.findMany({
      where: whereClause,
      include: {
        lote: true,
      },
    });

    return boletos.map(boleto => this.mapToDomain(boleto));
  }

  public async findById(id: number): Promise<BoletoEntity | null> {
    const boleto = await this.prisma.boleto.findUnique({
      where: {
        id,
        ativo: true,
      },
    });

    if (!boleto) {
      return null;
    }

    return this.mapToDomain(boleto);
  }

  public async save(boleto: BoletoEntity): Promise<BoletoEntity> {
    const { id, ...data } = {
      id: boleto.id,
      nome_sacado: boleto.nome_sacado,
      id_lote: boleto.id_lote,
      valor: boleto.valor,
      linha_digitavel: boleto.linha_digitavel,
      ativo: boleto.ativo,
    };

    if (id) {
      const updatedBoleto = await this.prisma.boleto.update({
        where: { id },
        data,
      });

      return this.mapToDomain(updatedBoleto);
    }

    const newBoleto = await this.prisma.boleto.create({
      data,
    });

    return this.mapToDomain(newBoleto);
  }

  public async saveMany(boletos: BoletoEntity[]): Promise<BoletoEntity[]> {
    return this.prisma.$transaction(async (tx) => {
      const savedBoletos: BoletoEntity[] = [];
      const errors: { boleto: BoletoEntity, message: string }[] = [];
      
      for (const boleto of boletos) {
        try {
          const existingBoleto = await tx.boleto.findFirst({
            where: {
              id_lote: boleto.id_lote,
              ativo: true
            },
          });
          
          if (!existingBoleto) {
            const { id, ...data } = {
              id: boleto.id,
              nome_sacado: boleto.nome_sacado,
              id_lote: boleto.id_lote,
              valor: boleto.valor,
              linha_digitavel: boleto.linha_digitavel,
              ativo: boleto.ativo,
            };
            
            const saved = await tx.boleto.create({
              data,
            });
            
            savedBoletos.push(this.mapToDomain(saved));
          } else {
            errors.push({ 
              boleto, 
              message: `Já existe um boleto ativo com o id_lote ${boleto.id_lote}`
            });
          }
        } catch (error) {
          errors.push({ 
            boleto, 
            message: `Erro ao salvar boleto: ${error.message}`
          });
        }
      }
      
      if (errors.length) {
        if (savedBoletos.length) {
          throw new Error(
            `Falha ao salvar boletos: ${errors.map(e => e.message).join('; ')}`
          );
        }
      }
      
      return savedBoletos;
    });
  }

  private mapToDomain(boleto: any): BoletoEntity {
    return new BoletoEntity({
      id: boleto.id,
      nome_sacado: boleto.nome_sacado,
      id_lote: boleto.id_lote,
      valor: Number(boleto.valor),
      linha_digitavel: boleto.linha_digitavel,
      ativo: boleto.ativo,
      criado_em: boleto.criado_em,
    });
  }
}

export { BoletoRepository };