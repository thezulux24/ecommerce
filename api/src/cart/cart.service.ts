import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, CartItem } from '@prisma/client';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async getCart(userId: string): Promise<any> {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: { include: { images: true } } } } },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: { items: { include: { product: { include: { images: true } } } } },
            });
        }

        return cart;
    }

    async addItem(userId: string, productId: string, quantity: number): Promise<CartItem> {
        const cart = await this.getCart(userId);
        const existingItem = cart.items.find((item) => item.productId === productId);

        if (existingItem) {
            return this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
            });
        }

        return this.prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
            },
        });
    }

    async updateItemQuantity(itemId: string, quantity: number): Promise<CartItem> {
        if (quantity <= 0) return this.removeItem(itemId);
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });
    }

    async removeItem(itemId: string): Promise<CartItem> {
        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }

    async clearCart(userId: string): Promise<void> {
        const cart = await this.getCart(userId);
        await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
}
