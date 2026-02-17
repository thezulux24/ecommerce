import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Bundle, Prisma } from '@prisma/client';
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class BundlesService {
    constructor(
        private prisma: PrismaService,
        private uploadsService: UploadsService
    ) { }

    async create(data: any): Promise<Bundle> {
        const { productIds, ...bundleData } = data;
        return this.prisma.bundle.create({
            data: {
                ...bundleData,
                products: {
                    create: productIds.map((productId: string) => ({
                        productId
                    }))
                }
            },
            include: { products: { include: { product: true } } }
        });
    }

    async findAll(): Promise<Bundle[]> {
        return this.prisma.bundle.findMany({
            include: { products: { include: { product: { include: { images: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(idOrSlug: string): Promise<Bundle> {
        const bundle = await this.prisma.bundle.findFirst({
            where: {
                OR: [
                    { id: idOrSlug },
                    { slug: idOrSlug }
                ]
            },
            include: { products: { include: { product: { include: { images: true } } } } },
        });
        if (!bundle) throw new NotFoundException(`Bundle ${idOrSlug} not found`);
        return bundle;
    }

    async update(id: string, data: any): Promise<Bundle> {
        const { productIds, ...bundleData } = data;

        // If productIds are provided, we replace the existing ones
        if (bundleData.image) {
            const oldBundle = await this.prisma.bundle.findUnique({ where: { id } });
            if (oldBundle?.image && oldBundle.image !== bundleData.image) {
                this.uploadsService.deleteFile(oldBundle.image);
            }
        }

        if (productIds) {
            await this.prisma.bundleProduct.deleteMany({ where: { bundleId: id } });
            await this.prisma.bundleProduct.createMany({
                data: productIds.map((productId: string) => ({
                    bundleId: id,
                    productId
                }))
            });
        }

        return this.prisma.bundle.update({
            where: { id },
            data: bundleData,
            include: { products: { include: { product: true } } }
        });
    }

    async remove(id: string): Promise<Bundle> {
        const bundle = await this.prisma.bundle.findUnique({ where: { id } });
        if (bundle?.image) {
            this.uploadsService.deleteFile(bundle.image);
        }
        return this.prisma.bundle.delete({ where: { id } });
    }
}
