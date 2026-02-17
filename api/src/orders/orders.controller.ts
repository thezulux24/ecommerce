import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';

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
    create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createFromCart(req.user.userId, createOrderDto.addressData);
    }

    @Get()
    findAll(@Request() req) {
        return this.ordersService.findAll(req.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req) {
        const order = await this.ordersService.findOne(id);
        // IDOR fix: verificar que el pedido pertenece al usuario o es admin
        if (order.userId !== req.user.userId && req.user.role !== Role.ADMIN) {
            throw new ForbiddenException('No tienes acceso a este pedido');
        }
        return order;
    }

    @Patch(':id/status')
    @UseGuards(RolesGuard)
    @Roles(Role.ADMIN)
    updateStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: UpdateOrderStatusDto,
    ) {
        return this.ordersService.updateStatus(id, updateStatusDto.status, updateStatusDto.trackingNumber);
    }
}
