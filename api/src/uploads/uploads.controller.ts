import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { UploadsService } from './uploads.service';

// Tipos de archivo permitidos
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@Controller('uploads')
export class UploadsController {
    constructor(private readonly uploadsService: UploadsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No se envió ningún archivo');
        }

        // Validar tipo de archivo
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            // Eliminar el archivo ya guardado por multer
            this.uploadsService.deleteFile(file.path);
            throw new BadRequestException(
                `Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten: ${ALLOWED_MIME_TYPES.join(', ')}`
            );
        }

        // Validar tamaño
        if (file.size > MAX_FILE_SIZE) {
            this.uploadsService.deleteFile(file.path);
            throw new BadRequestException(
                `Archivo demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB). Máximo permitido: ${MAX_FILE_SIZE / 1024 / 1024}MB`
            );
        }

        return {
            url: this.uploadsService.getStaticUrl(file.filename),
            filename: file.filename,
        };
    }
}
