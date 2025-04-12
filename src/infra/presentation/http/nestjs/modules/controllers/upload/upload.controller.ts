import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { FileUploadDto, FileUploadResponseDto } from './upload.dto';
import { ImportCsvUseCase, ProcessPdfUseCase } from '@/core/application/use-cases';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(
    private readonly importCsvUseCase: ImportCsvUseCase,
    private readonly processPdfUseCase: ProcessPdfUseCase,
  ) {}

  @Post('csv')
  @ApiOperation({ summary: 'Importar arquivo CSV de boletos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo fornecido');
    }

    if (!file.mimetype.includes('csv') && !file.originalname.endsWith('.csv')) {
      throw new UnsupportedMediaTypeException('O arquivo deve ser do tipo CSV');
    }

    try {
      const csvContent = file.buffer.toString('utf-8');
      const importedBoletos = await this.importCsvUseCase.execute(csvContent, file);
      
      return {
        message: 'CSV importado com sucesso',
        count: importedBoletos.length,
      };
    } catch (error) {
      throw new BadRequestException(`Erro ao processar CSV: ${error.message}`);
    }
  }

  @Post('pdf')
  @ApiOperation({ summary: 'Processar arquivo PDF de boletos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadPdf(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileUploadResponseDto> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo fornecido');
    }

    if (!file.mimetype.includes('pdf') && !file.originalname.endsWith('.pdf')) {
      throw new UnsupportedMediaTypeException('O arquivo deve ser do tipo PDF');
    }

    try {
      const outputDir = process.env.PDF_OUTPUT_DIR || './storage/boletos';
      const outputFiles = await this.processPdfUseCase.execute(
        file.buffer,
        outputDir,
        file
      );
      
      return {
        message: 'PDF processado com sucesso',
        count: outputFiles.length,
        files: outputFiles,
      };
    } catch (error) {
      throw new BadRequestException(`Erro ao processar PDF: ${error.message}`);
    }
  }
}