import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    getCart(@Request() req) {
        return this.cartService.getCart(req.user.userId);
    }

    @Post('items')
    addItem(@Request() req, @Body() body: { productId: string; quantity: number }) {
        return this.cartService.addItem(req.user.userId, body.productId, body.quantity);
    }

    @Patch('items/:id')
    updateQuantity(@Param('id') id: string, @Body() body: { quantity: number }) {
        return this.cartService.updateItemQuantity(id, body.quantity);
    }

    @Delete('items/:id')
    removeItem(@Param('id') id: string) {
        return this.cartService.removeItem(id);
    }

    @Delete()
    clearCart(@Request() req) {
        return this.cartService.clearCart(req.user.userId);
    }

    @Post('sync')
    syncCart(@Request() req, @Body('items') items: { productId: string; quantity: number }[]) {
        return this.cartService.syncCart(req.user.userId, items);
    }
}
