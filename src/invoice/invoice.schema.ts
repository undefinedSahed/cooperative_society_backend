import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvoiceDocument = Invoice & Document;

export enum InvoiceStatus {
    ISSUED = 'issued',
    CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Invoice {
    @Prop({ required: true, unique: true })
    invoiceNumber: string;

    @Prop({ type: Types.ObjectId, ref: 'Payment', required: true })
    paymentId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
    accountId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, min: 1, max: 12 })
    month: number;

    @Prop({ required: true })
    year: number;

    @Prop({ required: true })
    issuedDate: Date;

    @Prop({ required: true })
    dueDate: Date;

    @Prop()
    pdfUrl: string;

    @Prop({
        type: String,
        enum: InvoiceStatus,
        default: InvoiceStatus.ISSUED,
    })
    status: InvoiceStatus;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    generatedBy: Types.ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);