import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
    imports: [PrismaModule, UploadsModule],
    controllers: [BrandsController],
    providers: [BrandsService],
    exports: [BrandsService],
})
export class BrandsModule { }
