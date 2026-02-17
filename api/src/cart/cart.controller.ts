import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddCartItemDto, UpdateCartItemDto, SyncCartDto } from './dto/cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    getCart(@Request() req) {
        return this.cartService.getCart(req.user.userId);
    }

    @Post('items')
    addItem(@Request() req, @Body() body: AddCartItemDto) {
        return this.cartService.addItem(req.user.userId, body.productId, body.quantity, body.bundleId);
    }

    @Patch('items/:id')
    updateQuantity(@Param('id') id: string, @Body() body: UpdateCartItemDto) {
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
    syncCart(@Request() req, @Body() body: SyncCartDto) {
        return this.cartService.syncCart(req.user.userId, body.items);
    }
}
