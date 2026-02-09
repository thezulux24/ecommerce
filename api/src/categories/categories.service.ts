import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.CategoryCreateInput): Promise<Category> {
        return this.prisma.category.create({ data });
    }

    async findAll(): Promise<Category[]> {
        return this.prisma.category.findMany({
            include: { children: true },
            where: { parentId: null },
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { children: true, products: true },
        });
        if (!category) throw new NotFoundException(`Category with ID ${id} not found`);
        return category;
    }

    async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Category> {
        return this.prisma.category.delete({ where: { id } });
    }
}
