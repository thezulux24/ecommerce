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
    await prisma.bundleProduct.deleteMany();
    await prisma.bundle.deleteMany();
    await prisma.product.deleteMany();
    await prisma.brand.deleteMany();
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

    // Create Brands
    const apexBrand = await prisma.brand.create({
        data: { name: 'Apex Labs', slug: 'apex-labs', description: 'Nuestra marca insignia de alto rendimiento.' }
    });
    const muscleTech = await prisma.brand.create({
        data: { name: 'MuscleTech', slug: 'muscletech', description: 'Líder mundial en nutrición deportiva.' }
    });
    const optimum = await prisma.brand.create({
        data: { name: 'Optimum Nutrition', slug: 'optimum-nutrition', description: 'Calidad superior en proteínas.' }
    });

    // Create Categories
    const proteina = await prisma.category.create({
        data: { name: 'Proteína', slug: 'proteinas', description: 'Proteína de suero y aislados para construcción muscular.' },
    });
    const creatina = await prisma.category.create({
        data: { name: 'Creatina', slug: 'creatina', description: 'Creatina monohidratada para fuerza y potencia.' },
    });
    const quemadores = await prisma.category.create({
        data: { name: 'Quemadores', slug: 'quemadores', description: 'Termogénicos y lipotrópicos para pérdida de grasa.' },
    });
    const bcaa = await prisma.category.create({
        data: { name: 'BCAA', slug: 'bcaa', description: 'Aminoácidos de cadena ramificada para recuperación.' },
    });
    const preEntreno = await prisma.category.create({
        data: { name: 'Pre-entreno', slug: 'pre-entreno', description: 'Energía y enfoque extremo para tus entrenamientos.' },
    });

    // Create Products
    const productsData = [
        {
            name: 'ISO Apex Whey',
            slug: 'iso-apex-whey',
            description: 'Aislado de proteína de suero puro de alta absorción y 0 carbohidratos.',
            price: '64.99',
            stock: 100,
            categoryId: proteina.id,
            brandId: apexBrand.id,
            images: ['https://images.unsplash.com/photo-1593095191850-2a7330053bb4?q=80&w=800'],
            metadata: { protein: '25g', carbs: '0g', servings: 30, flavor: 'Vainilla Glacial' },
        },
        {
            name: 'Apex Creatine Elite',
            slug: 'apex-creatine-elite',
            description: 'Creatina monohidratada micronizada para máxima pureza.',
            price: '34.99',
            stock: 150,
            categoryId: creatina.id,
            brandId: apexBrand.id,
            images: ['https://images.unsplash.com/photo-1579722820308-d74e5719d38e?q=80&w=800'],
            metadata: { purity: '100%', servings: 60, type: 'Monohydrate' },
        },
        {
            name: 'Thermal Burn X',
            slug: 'thermal-burn-x',
            description: 'Quemador de grasa termogénico de alta intensidad.',
            price: '44.99',
            stock: 50,
            categoryId: quemadores.id,
            brandId: muscleTech.id,
            images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800'],
            metadata: { capsules: 90, intensity: 'Extreme' },
        },
        {
            name: 'Nitro Surge V8',
            slug: 'nitro-surge-v8',
            description: 'Pre-entreno explosivo con cafeína y beta-alanina.',
            price: '39.99',
            stock: 80,
            categoryId: preEntreno.id,
            brandId: apexBrand.id,
            images: ['https://images.unsplash.com/photo-1579722820308-d74e5719d38e?q=80&w=800'],
            metadata: { caffeine: '300mg', servings: 30, focus: 'High' },
        }
    ];

    const createdProducts: any[] = [];
    for (const p of productsData) {
        const { images, ...productData } = p;
        const product = await prisma.product.create({
            data: {
                ...productData,
                images: { create: images.map(url => ({ url })) },
            },
        });
        createdProducts.push(product);
    }

    // Create Bundles
    await prisma.bundle.create({
        data: {
            name: 'Pack Hipertrofia Elite',
            slug: 'pack-hipertrofia-elite',
            description: 'El stack definitivo para ganar masa muscular magra rápidamente.',
            price: 89.99,
            oldPrice: 109.99,
            image: 'https://images.unsplash.com/photo-1593095191850-2a7330053bb4?q=80&w=800',
            features: [
                'Recuperación acelerada tras entrenos pesados',
                'Síntesis proteica optimizada al 100%',
                'Aumento visible de fuerza en 2 semanas',
                'Incluye guía de nutrición personalizada'
            ],
            products: {
                create: [
                    { productId: createdProducts[0].id },
                    { productId: createdProducts[1].id }
                ]
            }
        }
    });

    await prisma.bundle.create({
        data: {
            name: 'Pack Corte Extremo',
            slug: 'pack-corte-extremo',
            description: 'Define tu musculatura y elimina los últimos depósitos de grasa.',
            price: 69.99,
            oldPrice: 79.99,
            image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800',
            features: [
                'Efecto termogénico 24/7',
                'Control total del apetito y ansiedad',
                'Energía explosiva sin crashes',
                'Preserva masa muscular en déficit'
            ],
            products: {
                create: [
                    { productId: createdProducts[2].id },
                    { productId: createdProducts[3].id }
                ]
            }
        }
    });

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
