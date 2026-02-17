import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
    getStaticUrl(filename: string): string {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return `${baseUrl}/uploads/${filename}`;
    }

    deleteFile(url: string) {
        if (!url) return;
        try {
            const filename = url.split('/').pop();
            if (!filename) return;

            const filePath = path.join(process.cwd(), 'uploads', filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (err) {
            console.error('Error deleting file:', err);
        }
    }
}
