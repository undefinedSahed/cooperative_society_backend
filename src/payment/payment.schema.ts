import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentStatus {
    PAID = 'paid',
    UNPAID = 'unpaid',
}

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: Types.ObjectId, ref: 'Account', required: true })
    accountId: Types.ObjectId;

    @Prop({ required: true, min: 1, max: 12 })
    month: number;

    @Prop({ required: true })
    year: number;

    @Prop({ required: true })
    amount: number;

    @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.UNPAID })
    status: PaymentStatus;

    @Prop()
    paymentDate: Date;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    collectedBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Invoice' })
    invoiceId: Types.ObjectId;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);