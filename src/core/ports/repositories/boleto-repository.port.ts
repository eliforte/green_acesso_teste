import { BoletoEntity } from '@/core/domain/entities';

interface BoletoFilter {
  nome?: string;
  valor_inicial?: number;
  valor_final?: number;
  id_lote?: number;
}

interface BoletoRepositoryPort {
  save(boleto: BoletoEntity): Promise<BoletoEntity>;
  saveMany(boletos: BoletoEntity[]): Promise<BoletoEntity[]>;
  findAll(filter?: BoletoFilter): Promise<BoletoEntity[]>;
  findById(id: number): Promise<BoletoEntity | null>;
}

export { BoletoRepositoryPort, BoletoFilter };