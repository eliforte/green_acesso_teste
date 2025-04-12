
import { BoletoEntity } from '@/core/domain/entities';

interface CsvRecord {
  nome: string;
  unidade: string;
  valor: string;
  linha_digitavel: string;
}

interface CsvProcessorPort {
  parseContent(content: string): Promise<CsvRecord[]>;
  mapToBoletos(records: CsvRecord[]): Promise<BoletoEntity[]>;
}

export { CsvRecord, CsvProcessorPort };