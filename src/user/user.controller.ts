import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './user.schema';
import { sendResponse } from 'src/common/utils/response.util';
import { UserOrAdminGuard } from 'src/common/guards/user-or-admin.guard';
import { AssignRoleDto } from './dto/assign-role.dto';

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

  // Assign user role (Admin only)
  @Patch('assign-role/:phoneNumber')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async assignRole(
    @Param('phoneNumber') phoneNumber: string,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    const data = await this.userService.changeUserRole(phoneNumber, assignRoleDto.role);
    return sendResponse(data, 'User role updated successfully', HttpStatus.OK);
  }

  // Get all users (Admin only)
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    const data = await this.userService.findAllUsers();
    return sendResponse(data, 'Users retrieved successfully', HttpStatus.OK);
  }
}
