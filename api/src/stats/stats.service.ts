import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class StatsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const totalSales = await this.prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: { not: 'CANCELLED' } }
        });

        const totalOrders = await this.prisma.order.count();
        const totalCustomers = await this.prisma.user.count({ where: { role: Role.USER } });

        const recentOrders = await this.prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { user: true }
        });

        const lowStockProducts = await this.prisma.product.findMany({
            where: { stock: { lte: 10 } },
            take: 5,
            include: { images: true }
        });

        // Calculate conversion rate: (orders / unique customers) * 100
        const conversionRate = totalCustomers > 0
            ? ((totalOrders / totalCustomers) * 100).toFixed(1)
            : 0;

        return {
            totalSales: totalSales._sum.totalAmount || 0,
            totalOrders,
            totalCustomers,
            conversionRate,
            recentOrders: recentOrders.map(o => ({
                id: o.id,
                customer: `${o.user?.firstName || ''} ${o.user?.lastName || ''}`.trim() || 'Cliente Anónimo',
                amount: o.totalAmount,
                status: o.status,
                createdAt: o.createdAt
            })),
            lowStockProducts: lowStockProducts.map(p => ({
                id: p.id,
                name: p.name,
                stock: p.stock,
                image: p.images[0]?.url || ''
            }))
        };
    }

    async getReportData() {
        const orders = await this.prisma.order.findMany({
            include: {
                user: true,
                items: { include: { product: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return orders.map(o => ({
            'ID Pedido': o.id,
            'Fecha': o.createdAt,
            'Cliente': `${o.user?.firstName || ''} ${o.user?.lastName || ''}`,
            'Email': o.user?.email,
            'Total': o.totalAmount,
            'Estado': o.status,
            'Items': o.items.map(i => `${i.product.name} (x${i.quantity})`).join(', ')
        }));
    }
}
