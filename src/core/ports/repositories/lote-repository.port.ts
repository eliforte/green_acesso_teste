import { LoteEntity } from '@/core/domain/entities';

interface LoteRepositoryPort {
  findByNome(nome: string): Promise<LoteEntity | null>;
  findAll(): Promise<LoteEntity[]>;
}

export { LoteRepositoryPort };