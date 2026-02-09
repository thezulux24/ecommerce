import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.ProductCreateInput): Promise<Product> {
        return this.prisma.product.create({ data });
    }

    async findAll(query?: { category?: string; search?: string }): Promise<Product[]> {
        const where: Prisma.ProductWhereInput = {};
        if (query?.category) {
            where.category = { slug: query.category };
        }
        if (query?.search) {
            where.OR = [
                { name: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.product.findMany({
            where,
            include: { images: true, category: true },
        });
    }

    async findOne(id: string): Promise<Product> {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { images: true, category: true, reviews: { include: { user: true } } },
        });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
        return product;
    }

    async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Product> {
        return this.prisma.product.delete({ where: { id } });
    }
}
