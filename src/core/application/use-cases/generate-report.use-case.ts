import { BoletoFilter, BoletoRepositoryPort } from '@/core/ports/repositories';
import { BoletoEntity } from '../../domain/entities/boleto.entity';
import { PdfProcessorPort } from '@/core/ports/services';

class GenerateReportUseCase {
  constructor(
    private readonly boletoRepository: BoletoRepositoryPort,
    private readonly pdfProcessor: PdfProcessorPort
  ) {}

  async execute(filter?: BoletoFilter): Promise<{ base64: string, boletos: BoletoEntity[] }> {
    try {
      const boletos = await this.boletoRepository.findAll(filter);
      
      if (!boletos.length) {
        throw new Error('Nenhum boleto encontrado com os filtros especificados');
      }
      
      const headers: Record<keyof Partial<BoletoEntity>, string> = {
        id: 'ID',
        nome_sacado: 'Nome do Sacado',
        id_lote: 'ID do Lote',
        valor: 'Valor (R$)',
        linha_digitavel: 'Linha Digitável',
        ativo: 'Ativo',
        criado_em: 'Data de Criação',
      };
      
      const pdfBuffer = await this.pdfProcessor.generateReport(boletos, headers);
      const base64 = pdfBuffer.toString('base64');
      
      return {
        base64,
        boletos
      };
    } catch (error) {
      throw new Error(`Falha ao gerar relatório: ${error.message}`);
    }
  }
}

export { GenerateReportUseCase };