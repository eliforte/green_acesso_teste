import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Arquivo para upload' })
  file: any;
}

export class FileUploadResponseDto {
  @ApiProperty({ description: 'Mensagem de sucesso' })
  message: string;

  @ApiProperty({ description: 'Quantidade de itens processados' })
  count: number;

  @ApiPropertyOptional({ type: [String], description: 'Caminhos dos arquivos gerados' })
  files?: string[];
}