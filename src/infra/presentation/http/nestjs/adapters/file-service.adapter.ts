import { FileInfo, FileSaveResult, FileServicePort } from '@/core/ports/services';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
class FileServiceAdapter implements FileServicePort {
  private readonly defaultDirectory: string;

  constructor() {
    this.defaultDirectory = process.env.FILE_STORAGE_PATH || './storage';
  }

  async saveFile(
    file: FileInfo,
    directory?: string,
  ): Promise<FileSaveResult> {
    try {
      const targetDir = directory || this.defaultDirectory;
      
      await this.ensureDirectory(targetDir);
      
      const filepath = path.join(targetDir, file.filename);
      
      await fs.writeFile(filepath, file.buffer);
      
      return {
        path: filepath,
        filename: file.filename,
        size: file.size,
      };
    } catch (error) {
      console.error('Erro ao salvar arquivo:', error);
      throw new Error(`Falha ao salvar arquivo: ${error.message}`);
    }
  }

  async readFile(filepath: string): Promise<Buffer> {
    try {
      return await fs.readFile(filepath);
    } catch (error) {
      throw new Error(`Falha ao ler arquivo: ${error.message}`);
    }
  }

  async fileExists(filepath: string): Promise<boolean> {
    try {
      await fs.access(filepath);
      return true;
    } catch {
      return false;
    }
  }

  async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      throw new Error(`Falha ao criar diretório: ${error.message}`);
    }
  }
}

export { FileServiceAdapter };
