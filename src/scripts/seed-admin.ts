import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRole, UserStatus } from '../user/user.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const adminUser: CreateUserDto = {
    fullName: 'System Admin',
    phoneNumber: '01700000000', // Default admin phone
    password: 'adminpassword', // Default admin password
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  };

  try {
    const existingAdmin = await userService.findByPhoneNumber(
      adminUser.phoneNumber,
    );
    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      await userService.create(adminUser);
      console.log('Admin user created successfully.');
      console.log('Phone:', adminUser.phoneNumber);
      console.log('Password:', adminUser.password);
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await app.close();
  }
}
bootstrap();
