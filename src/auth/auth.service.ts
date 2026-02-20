import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { errorResponse } from 'src/common/utils/response.util';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async validateUser(
    phoneNumber: string,
    pass: string,
  ): Promise<{ _id: any; phoneNumber: string; role: string } | null> {
    const user = await this.userModel
      .findOne({ phoneNumber })
      .select('+password');
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment
      const { password, ...result } = user.toObject();
      return result as { _id: any; phoneNumber: string; role: string };
    }
    return null;
  }

  login(user: { _id: any; phoneNumber: string; role: string }) {
    const payload = {
      phoneNumber: user.phoneNumber,
      sub: String(user._id),
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Change password
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<User> {
    const user = await this.userModel.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundException(
        errorResponse('User not found', HttpStatus.NOT_FOUND),
      );
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        errorResponse('Current password is incorrect', HttpStatus.UNAUTHORIZED),
      );
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    user.password = hashedPassword;

    return user.save();
  }
}
