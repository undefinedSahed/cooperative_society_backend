import { IsNotEmpty, IsNumber, Min, Max, IsEnum, IsOptional, IsMongoId, IsDateString } from 'class-validator';
import { PaymentStatus } from '../payment.schema';

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsMongoId({ message: 'accountId must be a valid MongoDB ObjectId' })
    accountId: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(12)
    month: number;

    @IsNotEmpty()
    @IsNumber()
    year: number;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsOptional()
    @IsEnum(PaymentStatus, { message: 'status must be either "paid" or "unpaid"' })
    status?: PaymentStatus;

    @IsOptional()
    @IsDateString({}, { message: 'paymentDate must be a valid ISO date string' })
    paymentDate?: Date;

    @IsOptional()
    @IsMongoId({ message: 'invoiceId must be a valid MongoDB ObjectId' })
    invoiceId?: string;
}