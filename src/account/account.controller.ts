import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/user/user.schema';
import { sendResponse } from 'src/common/utils/response.util';
import { UserOrAdminGuard } from 'src/common/guards/user-or-admin.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createAccountDto: CreateAccountDto) {
    const createdAccount = await this.accountService.create(createAccountDto);

    return sendResponse(
      createdAccount,
      'Account created successfully',
      HttpStatus.CREATED,
    );
  }

  // Get all accounts with user details (Admin only)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const data = await this.accountService.findAll();
    return sendResponse(data, 'Accounts retrieved successfully', HttpStatus.OK);
  }

  // Get a single account by ID (Admin and User can access their own account)
  @Get(':id')
  @UseGuards(JwtAuthGuard, UserOrAdminGuard)
  async findOne(@Param('id') id: string) {
    const data = await this.accountService.findOne(id);
    return sendResponse(data, 'Account retrieved successfully', HttpStatus.OK);
  }

  // Change account status (active/inactive) (Admin only)
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string) {
    const updatedAccount = await this.accountService.update(id);
    return sendResponse(updatedAccount, 'Account status updated successfully', HttpStatus.OK);
  }

  // Delete an account (Admin only)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const deletedAccount = await this.accountService.remove(id);
    return sendResponse(null, 'Account deleted successfully', HttpStatus.NO_CONTENT);
  }
}
