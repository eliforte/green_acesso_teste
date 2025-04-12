import { BoletoEntity } from '@/core/domain/entities';
import { LoteRepositoryPort } from '@/core/ports/repositories';
import { CsvProcessorPort, CsvRecord } from '@/core/ports/services';
import { Injectable } from '@nestjs/common';

@Injectable()
class CsvProcessorAdapter implements CsvProcessorPort {
  constructor(private readonly loteRepository: LoteRepositoryPort) {}

  async parseContent(content: string): Promise<CsvRecord[]> {
    try {
      const lines = content.split('\n');
      const headers = lines[0].split(';').map(header => header.trim());
      const records: CsvRecord[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = line.split(';');
        const record = {} as CsvRecord;
        
        headers.forEach((header, index) => {
          record[header as keyof CsvRecord] = values[index]?.trim() || '';
        });
        
        records.push(record);
      }
      
      return records;
    } catch (error) {
      throw new Error(`Falha ao processar o conteúdo do CSV: ${error.message}`);
    }
  }

  async mapToBoletos(records: CsvRecord[]): Promise<BoletoEntity[]> {
    try {
      if (!records.length) {
        return [];
      }
  
      const uniqueUnidades: string[] = [];
      for (const record of records) {
        const formattedUnidade = this.padLoteNome(record.unidade);
        if (!uniqueUnidades.includes(formattedUnidade)) {
          uniqueUnidades.push(formattedUnidade);
        }
      }
      
      const lotes = await this.loteRepository.findByNomes(uniqueUnidades);
      const boletos: BoletoEntity[] = [];
      
      for (const record of records) {
        const formattedUnidade = this.padLoteNome(record.unidade);
        const lote = lotes.find(l => l.nome.toLowerCase() === formattedUnidade.toLowerCase());
        
        if (!lote) {
          continue;
        }
        
        try {
          const valorNumerico = parseFloat(record.valor);
          if (isNaN(valorNumerico)) {
            continue;
          }
          
          const boleto = new BoletoEntity({
            nome_sacado: record.nome?.trim(),
            id_lote: lote.id!,
            valor: valorNumerico,
            linha_digitavel: record.linha_digitavel?.trim(),
          });
          
          boletos.push(boleto);
        } catch (error) {
          continue;
        }
      }
      
      return boletos;
    } catch (error) {
      throw new Error(`Falha ao mapear registros para boletos: ${error.message}`);
    }
  }

  private padLoteNome(nome: string): string {
    return nome.padStart(4, '0');
  }
}

export { CsvProcessorAdapter };