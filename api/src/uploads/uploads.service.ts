import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {
    getStaticUrl(filename: string): string {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return `${baseUrl}/uploads/${filename}`;
    }
}
