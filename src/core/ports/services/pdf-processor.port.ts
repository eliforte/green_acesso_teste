import { BoletoEntity } from "@/core/domain/entities";

interface PdfPageInfo {
  pageNumber: number;
  content: Buffer;
}

interface PdfProcessorPort {
  splitPages(pdfBuffer: Buffer): Promise<PdfPageInfo[]>;
  combinePages(pages: PdfPageInfo[]): Promise<Buffer>;
  generateReport(
    data: BoletoEntity[], 
    headers: Record<string, string>
  ): Promise<Buffer>;
}

export { PdfProcessorPort, PdfPageInfo };
