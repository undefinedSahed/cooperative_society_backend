import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentDocument } from './payment.schema';
import { Model, Connection } from 'mongoose';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { InvoiceService } from 'src/invoice/invoice.service';

@Injectable()
export class PaymentService {

    constructor(
        @InjectModel(Payment.name)
        private paymentModel: Model<PaymentDocument>,
        private invoiceService: InvoiceService,
        @InjectConnection()
        private readonly connection: Connection,
    ) { }

    async create(dto: CreatePaymentDto, userId: string) {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            // 1️⃣ Prevent duplicate
            const exists = await this.paymentModel.findOne({
                month: dto.month,
                year: dto.year,
                status: 'paid',
            });

            if (exists) {
                throw new Error('Payment already marked for this month');
            }

            // 2️⃣ Create payment
            const payment = await this.paymentModel.create(
                [
                    {
                        ...dto,
                        status: 'paid',
                        paymentDate: new Date(),
                        collectedBy: userId,
                    },
                ],
                { session },
            );

            // 3️⃣ Create invoice
            const invoice = await this.invoiceService.createInvoice(
                {
                    paymentId: payment[0]._id,
                    amount: dto.amount,
                    month: dto.month,
                    year: dto.year,
                    generatedBy: userId,
                },
                session,
            );

            await session.commitTransaction();
            session.endSession();

            return {
                message: 'Payment successful',
                invoiceUrl: invoice.pdfUrl,
            };
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
}
