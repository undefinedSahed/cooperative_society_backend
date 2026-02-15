import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config';

@Module({
  imports:
    [
      ConfigModule.forRoot({
        isGlobal: true,
        load: config
      }),
      MongooseModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          uri: configService.get<string>('mongodbUrl'),
        }),
      }),
      UserModule
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
