import { PrismaClient, Role, OrderStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing existing data...');
    // Clear existing data in reverse order of dependencies
    await prisma.payment.deleteMany();
    await prisma.review.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.productImage.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.address.deleteMany();
    await prisma.user.deleteMany();

    console.log('Seeding Apex Labs data...');

    // Create Users
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            email: 'admin@apexlabs.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'Apex',
            role: Role.ADMIN,
        },
    });

    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await prisma.user.create({
        data: {
            email: 'athlete@apexlabs.com',
            password: customerPassword,
            firstName: 'Elite',
            lastName: 'Athlete',
            role: Role.USER,
            cart: { create: {} },
            addresses: {
                create: {
                    fullName: 'Elite Athlete',
                    street: '123 Performance Way',
                    city: 'Everest',
                    state: 'Peak State',
                    zipCode: '90001',
                    country: 'United States',
                    type: 'SHIPPING',
                    isDefault: true,
                },
            },
        },
        include: { addresses: true },
    });

    // Create Categories
    const performance = await prisma.category.create({
        data: { name: 'Mejorar rendimiento', slug: 'mejorar-rendimiento', description: 'Potenciadores de energía, resistencia y fuerza.' },
    });

    const recovery = await prisma.category.create({
        data: { name: 'Ganar masa muscular', slug: 'ganar-masa-muscular', description: 'Proteína y aminoácidos para el crecimiento muscular.' },
    });

    const wellness = await prisma.category.create({
        data: { name: 'Perder grasa', slug: 'perder-grasa', description: 'Optimizadores metabólicos y quema de grasa.' },
    });

    // Create Products
    const products = [
        {
            name: 'Apex Pure Whey',
            slug: 'apex-pure-whey',
            description: 'Ultra-filtered whey protein isolate for maximum absorption.',
            price: '54.99',
            stock: 100,
            categoryId: recovery.id,
            images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800'],
            metadata: {
                protein: '25g',
                carbs: '2g',
                servings: 30,
                flavor: 'Nitro Chocolate',
            },
        },
        {
            name: 'Nitro Pre-Workout',
            slug: 'nitro-pre-workout',
            description: 'Explosive energy and laser focus for your most intense sessions.',
            price: '39.99',
            stock: 75,
            categoryId: performance.id,
            images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800'],
            metadata: {
                caffeine: '300mg',
                betaAlanine: '3.2g',
                flavor: 'Electric Lime',
            },
        },
        {
            name: 'Daily Optimizer Multivitamin',
            slug: 'daily-optimizer',
            description: 'Full spectrum of essential vitamins and minerals for elite health.',
            price: '24.99',
            stock: 150,
            categoryId: wellness.id,
            images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800'],
            metadata: {
                count: 60,
                form: 'Capsule',
                focus: 'Immunity',
            },
        },
        {
            name: 'Apex BCAA 2:1:1',
            slug: 'apex-bcaa',
            description: 'Intra-workout hydration and muscle sparing formula.',
            price: '29.99',
            stock: 90,
            categoryId: recovery.id,
            images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800'],
            metadata: {
                bcaas: '7g',
                sugar: '0g',
                flavor: 'Vibrant Orange',
            },
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
