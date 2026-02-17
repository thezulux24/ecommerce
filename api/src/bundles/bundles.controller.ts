import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BundlesService } from './bundles.service';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('bundles')
export class BundlesController {
    constructor(private readonly bundlesService: BundlesService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    create(@Body() createBundleDto: any) {
        const slug = createBundleDto.slug || createBundleDto.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return this.bundlesService.create({
            ...createBundleDto,
            slug
        });
    }

    @Get()
    findAll() {
        return this.bundlesService.findAll();
    }

    @Get(':idOrSlug')
    findOne(@Param('idOrSlug') idOrSlug: string) {
        return this.bundlesService.findOne(idOrSlug);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateBundleDto: any) {
        return this.bundlesService.update(id, updateBundleDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.bundlesService.remove(id);
    }
}
