import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/user.service';
import { UserRole, UserStatus } from './user/user.schema';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userService = app.get(UserService);

    const adminPhone = '01619778199';
    const existingAdmin = await userService.findByPhoneNumber(adminPhone);

    if (!existingAdmin) {
        try {
            await userService.create({
                fullName: 'Md. Sahed Rahman',
                phoneNumber: adminPhone,
                password: '12345678', // Use a strong password in production
                role: UserRole.ADMIN,
                status: UserStatus.ACTIVE,
            });
            console.log('Admin user created successfully');
        } catch (error) {
            console.error('Error creating admin user:', error);
        }
    } else {
        console.log('Admin user already exists');
    }

    await app.close();
}

bootstrap();
