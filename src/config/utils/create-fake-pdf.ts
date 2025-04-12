import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function createDummyPdf() {
  try {
    const pdfDoc = await PDFDocument.create();
    
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const page1 = pdfDoc.addPage([595, 842]);
    page1.setFont(helveticaBold);
    page1.setFontSize(24);
    page1.drawText('BOLETO DE MARCIA CARVALHO', {
      x: 50,
      y: 800,
      color: rgb(0, 0, 0),
    });
    
    page1.setFont(helveticaFont);
    page1.setFontSize(14);
    page1.drawText('Valor: R$ 128,00', {
      x: 50,
      y: 750,
      color: rgb(0, 0, 0),
    });
    
    page1.drawText('Linha Digitável: 123456123456123456', {
      x: 50,
      y: 700,
      color: rgb(0, 0, 0),
    });
    
    page1.drawText('Unidade: 19', {
      x: 50,
      y: 650,
      color: rgb(0, 0, 0),
    });
    
    const page2 = pdfDoc.addPage([595, 842]);
    page2.setFont(helveticaBold);
    page2.setFontSize(24);
    page2.drawText('BOLETO DE JOSE DA SILVA', {
      x: 50,
      y: 800,
      color: rgb(0, 0, 0),
    });
    
    page2.setFont(helveticaFont);
    page2.setFontSize(14);
    page2.drawText('Valor: R$ 182,54', {
      x: 50,
      y: 750,
      color: rgb(0, 0, 0),
    });
    
    page2.drawText('Linha Digitável: 123456123456123456', {
      x: 50,
      y: 700,
      color: rgb(0, 0, 0),
    });
    
    page2.drawText('Unidade: 17', {
      x: 50,
      y: 650,
      color: rgb(0, 0, 0),
    });
    
    const page3 = pdfDoc.addPage([595, 842]);
    page3.setFont(helveticaBold);
    page3.setFontSize(24);
    page3.drawText('BOLETO DE MARCOS ROBERTO', {
      x: 50,
      y: 800,
      color: rgb(0, 0, 0),
    });
    
    page3.setFont(helveticaFont);
    page3.setFontSize(14);
    page3.drawText('Valor: R$ 178,20', {
      x: 50,
      y: 750,
      color: rgb(0, 0, 0),
    });
    
    page3.drawText('Linha Digitável: 123456123456123456', {
      x: 50,
      y: 700,
      color: rgb(0, 0, 0),
    });
    
    page3.drawText('Unidade: 18', {
      x: 50,
      y: 650,
      color: rgb(0, 0, 0),
    });
    
    const pdfBytes = await pdfDoc.save();
    
    const dir = './output';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const outputPath = path.join(dir, 'boletos-exemplo.pdf');
    fs.writeFileSync(outputPath, pdfBytes);
    
    console.log(`PDF de exemplo criado em: ${outputPath}`);
  } catch (error) {
    console.error('Erro ao criar PDF de exemplo:', error);
  }
}

createDummyPdf();