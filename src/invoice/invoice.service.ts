import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from './invoice.schema';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PdfService } from './pdf.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class InvoiceService {
    constructor(
        @InjectModel(Invoice.name)
        private invoiceModel: Model<InvoiceDocument>,
        private pdfService: PdfService,
        private cloudinaryService: CloudinaryService,
    ) { }

    async createInvoice(data: any, session: any) {
        const invoiceNumber = await this.generateInvoiceNumber();

        const invoice = new this.invoiceModel({
            ...data,
            invoiceNumber,
            issuedDate: new Date(),
            dueDate: new Date(),
        });

        await invoice.save({ session });

        // Generate PDF
        const pdfBuffer = await this.pdfService.generateInvoicePdf({
            ...data,
            invoiceNumber,
            issuedDate: new Date(),
        });

        const fileName = `invoice-${invoiceNumber}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`;

        // Upload to Cloudinary
        const pdfUrl = await this.cloudinaryService.uploadPdf(pdfBuffer, fileName);

        invoice.pdfUrl = pdfUrl;
        await invoice.save({ session });

        return invoice;
    }

    async generateInvoiceNumber(): Promise<string> {
        const count = await this.invoiceModel.countDocuments();
        const year = new Date().getFullYear();
        return `INV-${year}-${count + 1}`;
    }
}
