import { LoteEntity } from '@/core/domain/entities';

interface LoteRepositoryPort {
  findByNome(nome: string): Promise<LoteEntity | null>;
  findAll(): Promise<LoteEntity[]>;
  findByNomes(nomes: string[]): Promise<LoteEntity[]>;
}

export { LoteRepositoryPort };