import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { sendResponse, errorResponse } from '../common/utils/response.util';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserDecorator } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.phoneNumber,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException(
        errorResponse(
          'Invalid phone number or password',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    }

    const data = this.authService.login(user);
    return sendResponse(data, 'Login successful');
  }

  // Change password endpoint
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @UserDecorator('userId') userId: string,
  ) {
    await this.authService.changePassword(userId, changePasswordDto);
    return sendResponse(null, 'Password changed successfully');
  }
}
