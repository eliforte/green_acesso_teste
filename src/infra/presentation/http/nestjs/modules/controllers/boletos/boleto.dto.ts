import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class BoletoFilterDto {
  @ApiPropertyOptional({ description: 'Filtrar por nome do sacado' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Valor inicial para filtro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  valor_inicial?: number;

  @ApiPropertyOptional({ description: 'Valor final para filtro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  valor_final?: number;

  @ApiPropertyOptional({ description: 'ID do lote para filtro' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_lote?: number;

  @ApiPropertyOptional({ description: 'Se 1, retorna relatório em PDF' })
  @IsOptional()
  @IsString()
  relatorio?: string;
}

export class BoletoResponseDto {
  @ApiProperty({ description: 'ID do boleto' })
  id?: number;

  @ApiProperty({ description: 'Nome do sacado' })
  nome_sacado: string;

  @ApiProperty({ description: 'ID do lote' })
  id_lote: number;

  @ApiProperty({ description: 'Valor do boleto' })
  valor: number;

  @ApiProperty({ description: 'Linha digitável' })
  linha_digitavel: string;

  @ApiProperty({ description: 'Status do boleto' })
  ativo: boolean;

  @ApiProperty({ description: 'Data de criação' })
  criado_em: Date;
}

export class ReportResponseDto {
  @ApiProperty({ 
    description: 'Conteúdo do PDF em formato base64',
    example: 'JVBERi0xLjcKJeLjz9MKMyAwIG9iago8PC9...' 
  })
  base64: string;
}