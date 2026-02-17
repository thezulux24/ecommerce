import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Category } from '@prisma/client';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class CategoriesService {
    constructor(
        private prisma: PrismaService,
        private uploadsService: UploadsService
    ) { }

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
        if (data.image) {
            const oldCategory = await this.prisma.category.findUnique({ where: { id } });
            if (oldCategory?.image && oldCategory.image !== data.image) {
                this.uploadsService.deleteFile(oldCategory.image);
            }
        }
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async remove(id: string): Promise<Category> {
        const category = await this.prisma.category.findUnique({ where: { id } });
        if (category?.image) {
            this.uploadsService.deleteFile(category.image);
        }
        return this.prisma.category.delete({ where: { id } });
    }
}
