import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Relative import fix
import { ConfigService } from '@nestjs/config';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

async function bootstrap() {
  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const configService = app.get(ConfigService);
    const connection = app.get<Connection>(getConnectionToken());

    const mongoUrl = configService.get<string>('mongodbUrl');
    console.log('---------------------------------------------------');
    console.log('DEBUG INFO:');

    if (mongoUrl) {
      // Safe logging of URL
      const masked = mongoUrl.replace(/(\/\/)([^:]+):([^@]+)@/, '$1***:***@');
      console.log(`Connected to MongoDB: ${masked}`);
    } else {
      console.log('Connected to MongoDB: undefined (Config missing?)');
    }

    if (connection.name) {
      console.log(`Database Name: ${connection.name}`);
    }

    if (connection.db) {
      const collections = await connection.db.listCollections().toArray();
      console.log('Collections found:');
      if (collections.length === 0) {
        console.log('  (No collections found)');
      } else {
        for (const col of collections) {
          console.log(`  - ${col.name}`);
          if (col.name.toLowerCase().includes('user')) {
            const count = await connection.db
              .collection(col.name)
              .countDocuments();
            console.log(`    Docs in ${col.name}: ${count}`);
            const samples = await connection.db
              .collection(col.name)
              .find()
              .limit(3)
              .toArray();
            console.log('    Sample docs:', JSON.stringify(samples, null, 2));
          }
        }
      }
    } else {
      console.log('connection.db object is undefined');
    }
    console.log('---------------------------------------------------');
    await app.close();
  } catch (error) {
    console.error('Debug script failed:', error);
  }
}

void bootstrap();
