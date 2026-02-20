import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/user.schema';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { sendResponse } from 'src/common/utils/response.util';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CASHIER)
  async create(@Body() dto: CreatePaymentDto, @UserDecorator() user: any) {
    const result = await this.paymentService.create(dto, user._id);
    return sendResponse(result, 'Payment marked as paid and invoice generated successfully');
  }
}
