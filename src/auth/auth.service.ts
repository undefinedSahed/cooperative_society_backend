import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    phoneNumber: string,
    pass: string,
  ): Promise<{ _id: any; phoneNumber: string; role: string } | null> {
    const user = await this.userService.findByPhoneNumber(phoneNumber);
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
}
