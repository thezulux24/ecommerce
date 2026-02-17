import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Brand } from '@prisma/client';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class BrandsService {
    constructor(
        private prisma: PrismaService,
        private uploadsService: UploadsService
    ) { }

    async create(data: Prisma.BrandCreateInput): Promise<Brand> {
        return this.prisma.brand.create({ data });
    }

    async findAll(): Promise<Brand[]> {
        return this.prisma.brand.findMany({
            include: { _count: { select: { products: true } } },
        });
    }

    async findOne(id: string): Promise<Brand> {
        const brand = await this.prisma.brand.findUnique({
            where: { id },
            include: { products: true },
        });
        if (!brand) throw new NotFoundException(`Brand with ID ${id} not found`);
        return brand;
    }

    async update(id: string, data: Prisma.BrandUpdateInput): Promise<Brand> {
        if (data.logo) {
            const oldBrand = await this.prisma.brand.findUnique({ where: { id } });
            if (oldBrand?.logo && oldBrand.logo !== data.logo) {
                this.uploadsService.deleteFile(oldBrand.logo);
            }
        }
        return this.prisma.brand.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Brand> {
        const brand = await this.prisma.brand.findUnique({ where: { id } });
        if (brand?.logo) {
            this.uploadsService.deleteFile(brand.logo);
        }
        return this.prisma.brand.delete({ where: { id } });
    }
}
