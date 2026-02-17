import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
    private readonly logger = new Logger(UploadsService.name);
    private readonly uploadsDir = path.resolve(process.cwd(), 'uploads');

    getStaticUrl(filename: string): string {
        const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
        return `${baseUrl}/uploads/${filename}`;
    }

    deleteFile(urlOrPath: string) {
        if (!urlOrPath) return;
        try {
            let filePath: string;

            // Si es un path absoluto (desde multer), usarlo directamente
            if (path.isAbsolute(urlOrPath)) {
                filePath = urlOrPath;
            } else {
                // Si es una URL, extraer el filename
                const filename = urlOrPath.split('/').pop();
                if (!filename) return;

                // Sanitizar: solo permitir caracteres alfanuméricos, guiones, puntos y guiones bajos
                const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
                if (sanitizedFilename !== filename) {
                    this.logger.warn(`Intento de path traversal detectado: ${filename}`);
                    return;
                }

                filePath = path.join(this.uploadsDir, sanitizedFilename);
            }

            // Verificar que el archivo resuelto está dentro del directorio de uploads
            const resolvedPath = path.resolve(filePath);
            if (!resolvedPath.startsWith(this.uploadsDir)) {
                this.logger.warn(`Path traversal bloqueado: ${resolvedPath} está fuera de ${this.uploadsDir}`);
                return;
            }

            if (fs.existsSync(resolvedPath)) {
                fs.unlinkSync(resolvedPath);
                this.logger.log(`Archivo eliminado: ${resolvedPath}`);
            }
        } catch (err) {
            this.logger.error('Error eliminando archivo:', err);
        }
    }
}
