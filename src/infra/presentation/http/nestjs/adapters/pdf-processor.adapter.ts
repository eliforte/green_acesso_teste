import { BoletoEntity } from '@/core/domain/entities';
import { PdfPageInfo, PdfProcessorPort } from '@/core/ports/services';
import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable()
class PdfProcessorAdapter implements PdfProcessorPort {
  async splitPages(pdfBuffer: Buffer): Promise<PdfPageInfo[]> {
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const pageCount = pdfDoc.getPageCount();
      
      const result: PdfPageInfo[] = [];
      
      for (let i = 0; i < pageCount; i++) {
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(copiedPage);
        
        const pageBuffer = await newPdf.save();
        
        result.push({
          pageNumber: i + 1,
          content: Buffer.from(pageBuffer),
        });
      }
      
      return result;
    } catch (error) {
      throw new Error(`Falha ao dividir páginas do PDF: ${error.message}`);
    }
  }

  async combinePages(pages: PdfPageInfo[]): Promise<Buffer> {
    try {
      const sortedPages = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);
      
      const newPdf = await PDFDocument.create();
      
      for (const page of sortedPages) {
        const srcDoc = await PDFDocument.load(page.content);
        const [copiedPage] = await newPdf.copyPages(srcDoc, [0]);
        newPdf.addPage(copiedPage);
      }
      
      const combinedPdf = await newPdf.save();
      return Buffer.from(combinedPdf);
    } catch (error) {
      console.error('Erro ao combinar páginas do PDF:', error);
      throw new Error(`Falha ao combinar páginas do PDF: ${error.message}`);
    }
  }

  async generateReport(
    data: BoletoEntity[], 
    headers: Record<string, string>
  ): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = page.getSize();
    const margin = 50;
    let y = height - margin;
    const fontSize = 10;
    const headerFontSize = 16;
    const lineHeight = 20;
    
    page.drawText('Relatório de Boletos', {
      x: width / 2 - helveticaBoldFont.widthOfTextAtSize('Relatório de Boletos', headerFontSize) / 2,
      y: y,
      size: headerFontSize,
      font: helveticaBoldFont,
      color: rgb(0, 0, 0),
    });
    
    y -= lineHeight * 2;
    
    const keys = Object.keys(headers);
    const columnWidths: Record<string, number> = {};
    const tableWidth = width - (2 * margin);
    
    columnWidths['id'] = 40;
    columnWidths['nome_sacado'] = 150;
    columnWidths['id_lote'] = 60;
    columnWidths['valor'] = 80;
    columnWidths['linha_digitavel'] = 150;
    
    let remainingWidth = tableWidth;
    let definedColumns = 0;
    
    keys.forEach(key => {
      if (columnWidths[key]) {
        remainingWidth -= columnWidths[key];
        definedColumns++;
      }
    });
    
    const defaultColumnWidth = remainingWidth / Math.max(1, keys.length - definedColumns);
    
    keys.forEach(key => {
      if (!columnWidths[key]) {
        columnWidths[key] = defaultColumnWidth;
      }
    });
    
    let xPos = margin;
    
    keys.forEach(key => {
      page.drawText(headers[key], {
        x: xPos,
        y,
        size: fontSize,
        font: helveticaBoldFont,
        color: rgb(0, 0, 0),
      });
      xPos += columnWidths[key];
    });
    
    y -= lineHeight;
    
    page.drawLine({
      start: { x: margin, y },
      end: { x: width - margin, y },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    y -= lineHeight / 2;
    
    for (const item of data) {
      if (y < margin + lineHeight) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - margin;
      }
      
      xPos = margin;
      
      for (const key of keys) {
        let value = item[key as keyof BoletoEntity];
        
        if (key === 'valor' && typeof value === 'number') {
          value = value.toFixed(2).replace('.', ',');
        } else if (key === 'criado_em' && value instanceof Date) {
          value = value.toLocaleDateString('pt-BR');
        } else if (key === 'ativo') {
          value = value ? 'Sim' : 'Não';
        }
        
        let textValue = String(value || '-');
        const maxChars = Math.floor(columnWidths[key] / (fontSize * 0.5));
        if (textValue.length > maxChars) {
          textValue = textValue.substring(0, maxChars - 3) + '...';
        }
        
        let textX = xPos;
        if (key === 'valor' || key === 'id' || key === 'id_lote') {
          const textWidth = helveticaFont.widthOfTextAtSize(textValue, fontSize);
          textX = xPos + columnWidths[key] - textWidth - 5;
        }
        
        page.drawText(textValue, {
          x: textX,
          y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });
        
        xPos += columnWidths[key];
      }
      
      y -= lineHeight;
    }
    
    const currentDate = new Date().toLocaleDateString('pt-BR');
    const footerText = `Relatório gerado em: ${currentDate}`;
    
    page.drawText(footerText, {
      x: margin,
      y: margin / 2,
      size: 8,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await pdfDoc.save();
    
    return Buffer.from(pdfBytes);
  }
}

export { PdfProcessorAdapter };