import { BoletoFilter, BoletoRepositoryPort } from '@/core/ports/repositories';
import { BoletoEntity } from '@/core/domain/entities/boleto.entity';

class ListBoletosUseCase {
  constructor(
    private readonly boletoRepository: BoletoRepositoryPort
  ) {}

  async execute(filter?: BoletoFilter): Promise<BoletoEntity[]> {
    try {
      const boletos = await this.boletoRepository.findAll(filter);
      return boletos;
    } catch (error) {
      throw new Error(`Falha ao listar boletos: ${error.message}`);
    }
  }
}

export { ListBoletosUseCase };