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

    async createFromCart(userId: string, addressData: any): Promise<Order> {
        // Find or create address (Outside transaction is fine for now as it's a separate entity)
        let address = await this.prisma.address.findFirst({
            where: {
                userId,
                street: addressData.address,
                city: addressData.city,
                state: addressData.department,
            },
        });

        if (!address) {
            address = await this.prisma.address.create({
                data: {
                    userId,
                    fullName: `${addressData.firstName} ${addressData.lastName}`,
                    street: addressData.address,
                    city: addressData.city,
                    state: addressData.department,
                    zipCode: '000000',
                    country: 'Colombia',
                    phone: addressData.phone,
                },
            });
        }

        // Transaction to create order, order items, clear cart and REDUCE STOCK
        return this.prisma.$transaction(async (tx) => {
            // Get internal cart with items and stock info
            const cart = await tx.cart.findUnique({
                where: { userId },
                include: { items: { include: { product: true } } },
            });

            if (!cart || !cart.items.length) {
                throw new BadRequestException(`El carrito está vacío en el servidor (Items: 0). Por favor, intenta añadir los productos de nuevo.`);
            }

            const totalAmount = cart.items.reduce((sum, item) => {
                return sum + Number(item.product.price) * item.quantity;
            }, 0);

            // Create Order
            const order = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    shippingAddressId: address.id,
                    status: OrderStatus.PROCESSING,
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
            });

            // Reduce stock and validate availability
            for (const item of cart.items) {
                if (item.product.stock < item.quantity) {
                    throw new BadRequestException(`No hay suficiente stock para: ${item.product.name}. Disponible: ${item.product.stock}`);
                }

                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }

            // Clear Cart
            await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

            return order;
        });
    }

    async findAllAdmin(): Promise<Order[]> {
        return this.prisma.order.findMany({
            include: {
                items: { include: { product: true } },
                user: { select: { email: true, firstName: true, lastName: true } },
                shippingAddress: true
            },
            orderBy: { createdAt: 'desc' },
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

    async updateStatus(id: string, status: OrderStatus, trackingNumber?: string): Promise<Order> {
        if (status === OrderStatus.SHIPPED && !trackingNumber) {
            throw new BadRequestException('Se requiere un número de guía para marcar el pedido como enviado.');
        }

        return this.prisma.order.update({
            where: { id },
            data: {
                status,
                ...(trackingNumber && { trackingNumber })
            },
        });
    }
}
