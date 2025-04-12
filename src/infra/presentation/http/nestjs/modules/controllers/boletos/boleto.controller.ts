import {
  Controller,
  Get,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BoletoFilterDto, BoletoResponseDto, ReportResponseDto } from './boleto.dto';
import { GenerateReportUseCase, ListBoletosUseCase,  } from '@/core/application/use-cases';

@ApiTags('boletos')
@Controller('boletos')
export class BoletoController {
  constructor(
    private readonly generateReportUseCase: GenerateReportUseCase,
    private readonly listBoletosUseCase: ListBoletosUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar boletos com filtros opcionais ou gerar relatório' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de boletos', 
    type: [BoletoResponseDto] 
  })
  @ApiResponse({
    status: 200,
    description: 'Relatório em PDF (base64)',
    type: ReportResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Nenhum boleto encontrado'
  })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'valor_inicial', required: false, type: Number })
  @ApiQuery({ name: 'valor_final', required: false, type: Number })
  @ApiQuery({ name: 'id_lote', required: false, type: Number })
  @ApiQuery({ name: 'relatorio', required: false, type: String, description: 'Se 1, retorna base64 do PDF' })
  async findAll(@Query() filterDto: BoletoFilterDto): Promise<BoletoResponseDto[] | ReportResponseDto> {
    try {
      const filter = {
        nome: filterDto.nome,
        valor_inicial: filterDto.valor_inicial,
        valor_final: filterDto.valor_final,
        id_lote: filterDto.id_lote,
      };

      if (filterDto.relatorio === '1') {
        const result = await this.generateReportUseCase.execute(filter);
        
        return {
          base64: result.base64,
        };
      } 

      const boletos = await this.listBoletosUseCase.execute(filter);
        
      if (!boletos.length) {
        throw new NotFoundException('Nenhum boleto encontrado com os filtros especificados');
      }
        
      return boletos;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Erro ao buscar boletos: ${error.message}`);
    }
  }
}