import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { sendResponse, errorResponse } from '../common/utils/response.util';

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
}
