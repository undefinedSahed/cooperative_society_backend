import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
    async generateInvoicePdf(data: any): Promise<Buffer> {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));

        doc.on('end', () => { });

        doc.fontSize(20).text('INVOICE', { align: 'center' });
        doc.moveDown();

        doc.text(`Invoice Number: ${data.invoiceNumber}`);
        doc.text(`Account ID: ${data.accountId}`);
        doc.text(`Month: ${data.month}/${data.year}`);
        doc.text(`Amount: ${data.amount}`);
        doc.text(`Issued Date: ${data.issuedDate}`);

        doc.end();

        return new Promise((resolve) => {
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });
        });
    }
}