interface FileInfo {
  filename: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface FileSaveResult {
  path: string;
  filename: string;
  size: number;
}

interface FileServicePort {
  saveFile(file: FileInfo, directory?: string): Promise<FileSaveResult>;
  readFile(filepath: string): Promise<Buffer>;
  fileExists(filepath: string): Promise<boolean>;
  ensureDirectory(path: string): Promise<void>;
}

export { FileInfo, FileSaveResult, FileServicePort };
