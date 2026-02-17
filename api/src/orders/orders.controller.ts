import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrderStatus, Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get('admin/all')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    adminFindAll() {
        return this.ordersService.findAllAdmin();
    }

    @Post()
    create(@Request() req, @Body('addressData') addressData: any) {
        return this.ordersService.createFromCart(req.user.userId, addressData);
    }

    @Get()
    findAll(@Request() req) {
        return this.ordersService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    updateStatus(
        @Param('id') id: string,
        @Body('status') status: OrderStatus,
        @Body('trackingNumber') trackingNumber?: string
    ) {
        return this.ordersService.updateStatus(id, status, trackingNumber);
    }
}
