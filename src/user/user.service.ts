import {
  Injectable,
  ConflictException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import { errorResponse } from '../common/utils/response.util';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;

    const existingUser = await this.userModel.findOne({
      phoneNumber: createUserDto.phoneNumber,
    });

    if (existingUser) {
      throw new ConflictException(
        errorResponse('User already exists', HttpStatus.CONFLICT),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = new this.userModel({
      ...rest,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ phoneNumber }).exec();

    if (!user) {
      throw new NotFoundException(
        errorResponse('User not found', HttpStatus.NOT_FOUND),
      );
    }

    return this.userModel.findOne({ phoneNumber }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }
}
