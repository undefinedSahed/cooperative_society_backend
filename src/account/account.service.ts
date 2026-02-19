import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AccountDocument } from './account.schema';
import { errorResponse } from 'src/common/utils/response.util';
import { User, UserDocument } from 'src/user/user.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private accountModel: Model<AccountDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const { phoneNumber, joinDate, ...rest } = createAccountDto;

    // Find the user by phone number
    const user = await this.userModel.findOne({ phoneNumber });
    if (!user) {
      throw new NotFoundException(
        errorResponse(
          `User with phone number ${phoneNumber} does not exist`,
          HttpStatus.NOT_FOUND,
        ),
      );
    }
    const userId = user._id;

    // Extract year from joinDate
    const join = new Date(joinDate);
    const yearShort = join.getFullYear() % 100;

    // Find the last account for this year to get the serial number
    const lastAccount = await this.accountModel
      .findOne({ accountNumber: { $regex: `^wbycs${yearShort}` } })
      .sort({ createdAt: -1 })
      .exec();

    let serial = 1;
    if (lastAccount && lastAccount.accountNumber) {
      const match = lastAccount.accountNumber.match(/(\d+)$/);
      if (match) {
        serial = parseInt(match[1]) + 1;
      }
    }

    const accountNumber = `wbycs${yearShort}${serial.toString().padStart(2, '0')}`;

    const createdAccount = new this.accountModel({
      userId,
      accountNumber,
      joinDate,
      ...rest,
    });
    return createdAccount.save();
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
