import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PdfService } from './pdf.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }])
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, CloudinaryService, PdfService],
})
export class InvoiceModule { }
