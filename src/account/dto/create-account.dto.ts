import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsString()
  @IsNotEmpty()
  relation: string;

  @IsDateString()
  @IsNotEmpty()
  joinDate: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyInstallment?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalPaid?: number;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive';
}
