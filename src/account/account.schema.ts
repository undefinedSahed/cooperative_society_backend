import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AccountDocument = Account & Document;

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  accountName: string;

  @Prop({ required: true })
  accountNumber: string;

  @Prop({ required: true })
  accountType: string;

  @Prop({ required: true })
  relation: string;

  @Prop({ required: true })
  joinDate: Date;

  @Prop({ required: true, default: 1000 })
  monthlyInstallment: number;

  @Prop({ required: true, default: 0 })
  totalPaid: number;

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
