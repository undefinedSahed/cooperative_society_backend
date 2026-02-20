import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService implements OnModuleInit {
    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        const cloudinaryConfig = this.configService.get('cloudinary');

        cloudinary.config({
            cloud_name: cloudinaryConfig.cloud_name,
            api_key: cloudinaryConfig.api_key,
            api_secret: cloudinaryConfig.api_secret,
        });
    }

    async uploadPdf(buffer: Buffer, fileName: string): Promise<string> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: 'raw',
                        folder: 'invoices',
                        public_id: fileName,
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('No result returned from Cloudinary'));
                        resolve(result.secure_url);
                    },
                )
                .end(buffer);
        });
    }
}