import { Module } from '@nestjs/common';
import { BundlesService } from './bundles.service';
import { BundlesController } from './bundles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
    imports: [PrismaModule, UploadsModule],
    controllers: [BundlesController],
    providers: [BundlesService],
    exports: [BundlesService],
})
export class BundlesModule { }
