import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { Prisma } from '@prisma/client';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) { }

    @Post()
    create(@Body() createBrandDto: Prisma.BrandCreateInput) {
        return this.brandsService.create(createBrandDto);
    }

    @Get()
    findAll() {
        return this.brandsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.brandsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBrandDto: Prisma.BrandUpdateInput) {
        return this.brandsService.update(id, updateBrandDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.brandsService.remove(id);
    }
}
