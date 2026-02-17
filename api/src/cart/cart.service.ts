import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cart, CartItem } from '@prisma/client';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async getCart(userId: string): Promise<any> {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: { include: { images: true } },
                        bundle: true
                    }
                }
            },
        });

        if (!cart) {
            // Ensure user exists before creating cart to avoid P2003
            const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!userExists) throw new NotFoundException('Usuario no encontrado. Por favor, inicia sesión de nuevo.');

            cart = await this.prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: { include: { images: true } },
                            bundle: true
                        }
                    }
                },
            });
        }

        return cart;
    }

    async addItem(userId: string, productId: string | null, quantity: number, bundleId?: string): Promise<CartItem> {
        const cart = await this.getCart(userId);
        const existingItem = cart.items.find((item) =>
            (productId && item.productId === productId) || (bundleId && item.bundleId === bundleId)
        );

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
                bundleId,
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

    async syncCart(userId: string, items: { productId?: string; bundleId?: string; quantity: number }[]): Promise<any> {
        const cart = await this.getCart(userId);

        return this.prisma.$transaction(async (tx) => {
            // Clear existing
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            // Add new items
            if (items.length > 0) {
                await tx.cartItem.createMany({
                    data: items.map(item => ({
                        cartId: cart.id,
                        productId: item.productId || null,
                        bundleId: item.bundleId || null,
                        quantity: item.quantity
                    }))
                });
            }

            // Return updated cart within the same transaction context
            return tx.cart.findUnique({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: { include: { images: true } },
                            bundle: true
                        }
                    }
                },
            });
        });
    }
}
