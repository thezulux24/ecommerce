import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Clear existing data
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding data...');

    // Create Users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@onlinestore.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: Role.ADMIN,
        },
    });

    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await prisma.user.create({
        data: {
            email: 'customer@onlinestore.com',
            password: customerPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: Role.USER,
            cart: { create: {} },
        },
    });

    // Create Categories
    const furniture = await prisma.category.create({
        data: { name: 'Furniture', slug: 'furniture' },
    });

    const lighting = await prisma.category.create({
        data: { name: 'Lighting', slug: 'lighting' },
    });

    const decor = await prisma.category.create({
        data: { name: 'Decor', slug: 'decor' },
    });

    // Create Products
    const products = [
        {
            name: 'Modern Velvet Chair',
            slug: 'modern-velvet-chair',
            description: 'A comfortable and stylish velvet chair for your living room.',
            price: '299.99',
            stock: 15,
            categoryId: furniture.id,
            images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=800'],
        },
        {
            name: 'Nordic Wood Table',
            slug: 'nordic-wood-table',
            description: 'Minimalist wooden table made from sustainable oak.',
            price: '450.00',
            stock: 8,
            categoryId: furniture.id,
            images: ['https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800'],
        },
        {
            name: 'Designer Glass Lamp',
            slug: 'designer-glass-lamp',
            description: 'Hand-blown glass lamp with a sleek metallic base.',
            price: '120.00',
            stock: 25,
            categoryId: lighting.id,
            images: ['https://images.unsplash.com/photo-1507473885765-e6ed03ac1b11?q=80&w=800'],
        },
        {
            name: 'Abstract Marble Sculpture',
            slug: 'abstract-marble-sculpture',
            description: 'Modern art piece for your desk or shelf.',
            price: '85.00',
            stock: 40,
            categoryId: decor.id,
            images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800'],
        },
    ];

    for (const p of products) {
        const { images, ...productData } = p;
        await prisma.product.create({
            data: {
                ...productData,
                images: {
                    create: images.map(url => ({ url })),
                },
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
