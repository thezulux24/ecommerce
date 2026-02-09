import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private cartService: CartService,
    ) { }

    async createFromCart(userId: string, shippingAddress: string): Promise<Order> {
        const cart = await this.cartService.getCart(userId);
        if (!cart.items.length) {
            throw new BadRequestException('Cart is empty');
        }

        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + Number(item.product.price) * item.quantity;
        }, 0);

        // Transaction to create order, order items and clear cart
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    shippingAddress,
                    status: OrderStatus.PENDING,
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
            });

            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            return order;
        });
    }

    async findAll(userId: string): Promise<Order[]> {
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: { include: { product: true } }, user: true },
        });
        if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
        return order;
    }

    async updateStatus(id: string, status: OrderStatus): Promise<Order> {
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
}
