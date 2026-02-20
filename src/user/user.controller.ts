import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './user.schema';
import { sendResponse } from 'src/common/utils/response.util';
import { UserOrAdminGuard } from 'src/common/guards/user-or-admin.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Create a new user (Admin only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);
    data.password = "********";
    return sendResponse(data, 'User created successfully', HttpStatus.CREATED);
  }

  // Get a specific user by phone number (Admin and the user themselves)
  @Get(':phoneNumber')
  @UseGuards(JwtAuthGuard, UserOrAdminGuard)
  async findOne(@Param('phoneNumber') phoneNumber: string) {
    const data = await this.userService.findByPhoneNumber(phoneNumber);
    return sendResponse(data, 'User retrieved successfully', HttpStatus.OK);
  }
}
