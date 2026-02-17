import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private uploadsService: UploadsService
    ) { }

    async create(data: Prisma.ProductCreateInput): Promise<Product> {
        return this.prisma.product.create({ data });
    }

    async findAll(query?: { category?: string; search?: string; brand?: string; minPrice?: number; maxPrice?: number }): Promise<Product[]> {
        const where: Prisma.ProductWhereInput = {};

        if (query?.category) {
            where.category = { slug: query.category };
        }

        if (query?.brand) {
            where.brand = { slug: query.brand };
        }

        if (query?.minPrice !== undefined || query?.maxPrice !== undefined) {
            where.price = {
                gte: query.minPrice ? Number(query.minPrice) : undefined,
                lte: query.maxPrice ? Number(query.maxPrice) : undefined,
            };
        }

        if (query?.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.product.findMany({
            where,
            include: { images: true, category: true, brand: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(idOrSlug: string): Promise<Product> {
        const product = await this.prisma.product.findFirst({
            where: {
                OR: [
                    { id: idOrSlug },
                    { slug: idOrSlug }
                ]
            },
            include: { images: true, category: true, brand: true, reviews: { include: { user: true } } },
        });
        if (!product) throw new NotFoundException(`Product ${idOrSlug} not found`);
        return product;
    }

    async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { images: true }
        });

        if (product) {
            product.images.forEach(img => this.uploadsService.deleteFile(img.url));
        }

        return this.prisma.product.delete({ where: { id } });
    }
}
