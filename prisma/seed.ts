/**
 * Seed: al menos 5 registros por tabla, cada uno relacionado a su organización.
 * Cada organización tiene: 1 usuario, 1 categoría, 1 cliente, 1 producto, 1 proveedor.
 * Ejecutar con: npm run db:seed
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as bcrypt from 'bcryptjs';

const socketPath = process.env.DATABASE_SOCKET;
const dbConfig: Record<string, unknown> = {
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectTimeout: 30_000,
    acquireTimeout: 30_000,
};
if (socketPath) {
    dbConfig.socketPath = socketPath;
} else {
    dbConfig.host = process.env.DATABASE_HOST || 'localhost';
    dbConfig.port = parseInt(process.env.DATABASE_PORT || '3306', 10);
}

const adapter = new PrismaMariaDb(dbConfig);
const prisma = new PrismaClient({ adapter });

const HASHED_PASSWORD = bcrypt.hashSync('SeedPass123', 10);

async function main() {
    console.log('🌱 Iniciando seed (datos relacionados por organizationId)...');

    // 1. Organizations (5)
    const orgNits = ['900111222', '900333444', '900555666', '900777888', '900999000'];
    const organizations = await Promise.all(
        orgNits.map((nit, i) =>
            prisma.organization.upsert({
                where: { nit },
                create: {
                    nit,
                    dv: String((i + 1) % 11),
                    businessName: `Empresa Demo ${i + 1} S.A.S.`,
                    tradeName: `Demo ${i + 1}`,
                    address: `Calle ${i + 1} #${(i + 1) * 10}-${(i + 1) * 2}`,
                    city: 'Bogotá',
                    department: 'Cundinamarca',
                    email: `contacto@demo${i + 1}.com`,
                    taxRegime: i % 2 === 0 ? 'RESPONSABLE_IVA' : 'NO_RESPONSABLE_IVA',
                    usesDian: false,
                },
                update: {},
            })
        )
    );
    console.log(`  ✓ Organizations: ${organizations.length}`);

    // 2. Users (5): solo usuarios por organización. No se toca el super admin que ya creaste.
    const users = await Promise.all(
        organizations.map((org, i) =>
            prisma.user.upsert({
                where: { email: `user-org${i + 1}@demo.com` },
                create: {
                    email: `user-org${i + 1}@demo.com`,
                    password: HASHED_PASSWORD,
                    name: `Usuario Org Demo ${i + 1}`,
                    role: i === 0 ? 'ADMIN' : 'CASHIER',
                    isActive: true,
                    organizationId: org.id,
                },
                update: {},
            })
        )
    );
    console.log(`  ✓ Users: ${users.length} (uno por org; tu super admin no se modifica)`);

    // 3. Categories (5): una por organización
    const categoryNames = ['Abarrotes', 'Lácteos', 'Aseo', 'Bebidas', 'Panadería'];
    const categories = await Promise.all(
        organizations.map((org, i) =>
            prisma.category.upsert({
                where: {
                    name_organizationId: { name: categoryNames[i], organizationId: org.id },
                },
                create: {
                    name: categoryNames[i],
                    description: `Categoría ${categoryNames[i]} de ${org.businessName}`,
                    organizationId: org.id,
                },
                update: {},
            })
        )
    );
    console.log(`  ✓ Categories: ${categories.length} (cada una con organizationId)`);

    // 4. Customers (5): uno por organización
    const customersData = [
        { idType: 'CC' as const, idNumber: '1010101010', name: 'Juan Pérez García' },
        { idType: 'CC' as const, idNumber: '2020202020', name: 'María López Sánchez' },
        { idType: 'NIT' as const, idNumber: '800111222', name: 'Cliente Corp Uno' },
        { idType: 'CC' as const, idNumber: '3030303030', name: 'Carlos Rodríguez Díaz' },
        { idType: 'NIT' as const, idNumber: '800333444', name: 'Cliente Corp Dos' },
    ];
    const customers = await Promise.all(
        organizations.map((org, i) => {
            const c = customersData[i];
            return prisma.customer.upsert({
                where: {
                    idType_idNumber_organizationId: {
                        idType: c.idType,
                        idNumber: c.idNumber,
                        organizationId: org.id,
                    },
                },
                create: {
                    idType: c.idType,
                    idNumber: c.idNumber,
                    name: c.name,
                    taxRegime: 'NO_RESPONSABLE_IVA',
                    organizationId: org.id,
                },
                update: {},
            });
        })
    );
    console.log(`  ✓ Customers: ${customers.length} (uno por organización)`);

    // 5. Products (5): uno por organización, con categoryId de esa misma org
    const productNames = ['Arroz 1kg', 'Leche 1L', 'Jabón Barra', 'Gaseosa 400ml', 'Pan Baguette'];
    const products = await Promise.all(
        organizations.map((org, i) =>
            prisma.product.upsert({
                where: {
                    name_organizationId: { name: productNames[i], organizationId: org.id },
                },
                create: {
                    internalCode: `PROD-${String(2000 + i + 1).padStart(4, '0')}`,
                    name: productNames[i],
                    description: `Producto de ${org.businessName}`,
                    salePrice: (i + 1) * 2500,
                    costPrice: (i + 1) * 1500,
                    unitOfMeasure: '94',
                    taxType: 'EXCLUIDO',
                    taxPercentage: 0,
                    stock: 50 + i * 10,
                    minStock: 5,
                    isActive: true,
                    categoryId: categories[i].id,
                    organizationId: org.id,
                },
                update: {},
            })
        )
    );
    console.log(`  ✓ Products: ${products.length} (uno por org, con categoryId y organizationId)`);

    // 6. Suppliers (5): uno por organización
    const suppliersData = [
        { idNumber: '900123456', name: 'Proveedor Alimentos S.A.S.', contactName: 'Contacto Alimentos' },
        { idNumber: '900234567', name: 'Distribuidora Norte', contactName: 'Contacto Norte' },
        { idNumber: '900345678', name: 'Insumos del Sur', contactName: 'Contacto Sur' },
        { idNumber: '900456789', name: 'Mayorista Central', contactName: 'Contacto Central' },
        { idNumber: '900567890', name: 'Proveedor Express', contactName: 'Contacto Express' },
    ];
    const suppliers = await Promise.all(
        organizations.map((org, i) => {
            const s = suppliersData[i];
            return prisma.supplier.upsert({
                where: {
                    idNumber_organizationId: { idNumber: s.idNumber, organizationId: org.id },
                },
                create: {
                    idType: 'NIT',
                    idNumber: s.idNumber,
                    name: s.name,
                    contactName: s.contactName,
                    organizationId: org.id,
                },
                update: {},
            });
        })
    );
    console.log(`  ✓ Suppliers: ${suppliers.length} (uno por organización)`);

    console.log('✅ Seed completado. Cada organización tiene sus categorías, clientes, productos y proveedores relacionados por organizationId.');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
