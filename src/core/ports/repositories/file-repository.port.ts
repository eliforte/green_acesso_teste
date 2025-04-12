interface FileEntity {
  id?: string;
  filename: string;
  contentType: string;
  size: number;
  path: string;
  isPublic: boolean;
  createdAt?: Date;
}

interface FileRepositoryPort {
  save(file: Buffer, metadata: Omit<FileEntity, 'id' | 'size' | 'path' | 'createdAt'>): Promise<FileEntity>;
  findById(id: string): Promise<FileEntity | null>;
  findByFilename(filename: string): Promise<FileEntity | null>;
  getContent(id: string): Promise<Buffer | null>;
  delete(id: string): Promise<boolean>;
}

export { FileEntity, FileRepositoryPort }