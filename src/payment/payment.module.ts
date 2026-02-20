import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './payment.schema';
import { InvoiceService } from 'src/invoice/invoice.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { PdfService } from 'src/invoice/pdf.service';
import { Invoice, InvoiceSchema } from 'src/invoice/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, InvoiceService, CloudinaryService, PdfService],
})
export class PaymentModule { }
