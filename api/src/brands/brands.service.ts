import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Brand } from '@prisma/client';

@Injectable()
export class BrandsService {
    constructor(private prisma: PrismaService) { }

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
        return this.prisma.brand.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Brand> {
        return this.prisma.brand.delete({ where: { id } });
    }
}
