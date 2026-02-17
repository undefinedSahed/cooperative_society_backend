import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfigService } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const configService = app.get(ConfigService);
    const connection = app.get<Connection>(getConnectionToken());

    const mongoUrl = configService.get<string>('mongodbUrl');
    console.log('---------------------------------------------------');
    console.log(`Connected to MongoDB: ${mongoUrl?.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Mask creds
    console.log(`Database Name: ${connection.name}`);
    console.log('---------------------------------------------------');

    const collections = await connection.db.listCollections().toArray();
    console.log('Collections found:');
    if (collections.length === 0) {
        console.log('  (No collections found)');
    } else {
        collections.forEach((col) => console.log(`  - ${col.name}`));
    }
    console.log('---------------------------------------------------');

    const userStart = collections.find((c) => c.name.toLowerCase().startsWith('user'));
    if (userStart) {
        const count = await connection.collection(userStart.name).countDocuments();
        console.log(`Count of documents in '${userStart.name}': ${count}`);
        const users = await connection.collection(userStart.name).find().limit(5).toArray();
        console.log('Sample users:', JSON.stringify(users, null, 2));
    } else {
        console.log('WARNING: No collection starting with "user" found.');
    }

    await app.close();
}

void bootstrap();
