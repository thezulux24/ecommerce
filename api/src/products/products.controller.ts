import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    create(@Body() createProductDto: CreateProductDto) {
        const { images, categoryId, brandId, ...data } = createProductDto;

        const slug = data.slug || data.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return this.productsService.create({
            ...data,
            slug,
            category: { connect: { id: categoryId } },
            ...(brandId && { brand: { connect: { id: brandId } } }),
            images: images ? {
                create: images.map((url: string) => ({ url }))
            } : undefined
        });
    }

    @Get()
    findAll(@Query() query: { category?: string; search?: string; brand?: string; minPrice?: number; maxPrice?: number }) {
        return this.productsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
        const { images, categoryId, brandId, ...data } = updateProductDto;

        const updateData: any = { ...data };

        if (categoryId) {
            updateData.category = { connect: { id: categoryId } };
        }

        if (brandId) {
            updateData.brand = { connect: { id: brandId } };
        }

        if (images) {
            updateData.images = {
                deleteMany: {},
                create: images.map(url => ({ url }))
            };
        }

        return this.productsService.update(id, updateData);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.productsService.remove(id);
    }
}
