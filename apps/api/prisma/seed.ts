/**
 * Seed: 5 empresas nuevas con registros relacionados en todas las tablas.
 * No modifica el super usuario jcharris (solo crea usuarios demo por organización).
 * Ejecutar: npm run db:seed
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
    console.log('🌱 Iniciando seed (5 empresas nuevas + datos relacionados)...');

    // ─── 1. Organizaciones (5 nuevas) ─────────────────────────────────────
    const orgNits = ['901000001', '901000002', '901000003', '901000004', '901000005'];
    const orgNames = ['Tienda Norte S.A.S.', 'Supermercado Centro', 'Bodega Sur E.I.', 'Mini Market Este', 'Abarrotes Oeste'];
    const organizations = await Promise.all(
        orgNits.map((nit, i) =>
            prisma.organization.upsert({
                where: { nit },
                create: {
                    nit,
                    dv: String((i + 1) % 11),
                    businessName: orgNames[i] + (i % 2 === 0 ? ' S.A.S.' : ''),
                    tradeName: orgNames[i],
                    address: `Calle ${i + 10} #${(i + 1) * 20}-${(i + 1) * 3}`,
                    city: i % 2 === 0 ? 'Bogotá' : 'Medellín',
                    department: i % 2 === 0 ? 'Cundinamarca' : 'Antioquia',
                    email: `contacto@empresa${i + 1}.com`,
                    phone: `601${1000000 + i}`,
                    taxRegime: i % 2 === 0 ? 'RESPONSABLE_IVA' : 'NO_RESPONSABLE_IVA',
                    usesDian: false,
                },
                update: {},
            })
        )
    );
    console.log(`  ✓ Organizations: ${organizations.length}`);

    // ─── 2. Usuarios (1 por org; no se toca jcharris) ───────────────────────
    const users = await Promise.all(
        organizations.map((org, i) =>
            prisma.user.upsert({
                where: { email: `demo-org${i + 1}@seed.com` },
                create: {
                    email: `demo-org${i + 1}@seed.com`,
                    password: HASHED_PASSWORD,
                    name: `Usuario Demo Org ${i + 1}`,
                    role: i === 0 ? 'ADMIN' : 'CASHIER',
                    isActive: true,
                    organizationId: org.id,
                },
                update: {},
            })
        )
    );
    console.log(`  ✓ Users: ${users.length} (tu super user jcharris no se modifica)`);

    // ─── 3. Categorías (2 por org) ─────────────────────────────────────────
    const categoryNames = [
        ['Abarrotes', 'Bebidas'],
        ['Lácteos', 'Aseo'],
        ['Panadería', 'Granos'],
        ['Carnes', 'Verduras'],
        ['Snacks', 'Limpieza'],
    ];
    const categoriesByOrg: { id: string; organizationId: string }[][] = [];
    for (let o = 0; o < organizations.length; o++) {
        const cats = await Promise.all(
            categoryNames[o].map((name, idx) =>
                prisma.category.upsert({
                    where: {
                        name_organizationId: { name, organizationId: organizations[o].id },
                    },
                    create: {
                        name,
                        description: `Categoría ${name} - ${organizations[o].businessName}`,
                        organizationId: organizations[o].id,
                    },
                    update: {},
                })
            )
        );
        categoriesByOrg.push(cats);
    }
    console.log(`  ✓ Categories: ${categoriesByOrg.flat().length}`);

    // ─── 4. Clientes (2 por org) ───────────────────────────────────────────
    const customersByOrg: { id: string; organizationId: string }[][] = [];
    const customerData = [
        [
            { idType: 'CC' as const, idNumber: '1098765432', name: 'Ana García' },
            { idType: 'NIT' as const, idNumber: '800111333', name: 'Distribuidora ABC' },
        ],
        [
            { idType: 'CC' as const, idNumber: '1098765433', name: 'Luis Martínez' },
            { idType: 'CC' as const, idNumber: '1098765434', name: 'Carmen Ruiz' },
        ],
        [
            { idType: 'NIT' as const, idNumber: '800222444', name: 'Corp Semillas' },
            { idType: 'CC' as const, idNumber: '1098765435', name: 'Pedro Sánchez' },
        ],
        [
            { idType: 'CC' as const, idNumber: '1098765436', name: 'Laura Díaz' },
            { idType: 'NIT' as const, idNumber: '800333555', name: 'Alimentos XYZ' },
        ],
        [
            { idType: 'CC' as const, idNumber: '1098765437', name: 'Roberto López' },
            { idType: 'CC' as const, idNumber: '1098765438', name: 'Sofia Herrera' },
        ],
    ];
    for (let o = 0; o < organizations.length; o++) {
        const custs = await Promise.all(
            customerData[o].map((c) =>
                prisma.customer.upsert({
                    where: {
                        idType_idNumber_organizationId: {
                            idType: c.idType,
                            idNumber: c.idNumber,
                            organizationId: organizations[o].id,
                        },
                    },
                    create: {
                        idType: c.idType,
                        idNumber: c.idNumber,
                        name: c.name,
                        taxRegime: 'NO_RESPONSABLE_IVA',
                        organizationId: organizations[o].id,
                    },
                    update: {},
                })
            )
        );
        customersByOrg.push(custs);
    }
    console.log(`  ✓ Customers: ${customersByOrg.flat().length}`);

    // ─── 5. Proveedores (2 por org) ────────────────────────────────────────
    const suppliersByOrg: { id: string; organizationId: string }[][] = [];
    for (let o = 0; o < organizations.length; o++) {
        const orgId = organizations[o].id;
        const sups = await Promise.all([
            prisma.supplier.upsert({
                where: {
                    idNumber_organizationId: { idNumber: `90200000${o + 1}`, organizationId: orgId },
                },
                create: {
                    idType: 'NIT',
                    idNumber: `90200000${o + 1}`,
                    name: `Proveedor Principal Org ${o + 1}`,
                    contactName: `Contacto Org ${o + 1}`,
                    organizationId: orgId,
                },
                update: {},
            }),
            prisma.supplier.upsert({
                where: {
                    idNumber_organizationId: { idNumber: `90200001${o + 1}`, organizationId: orgId },
                },
                create: {
                    idType: 'NIT',
                    idNumber: `90200001${o + 1}`,
                    name: `Proveedor Secundario Org ${o + 1}`,
                    contactName: `Secundario ${o + 1}`,
                    organizationId: orgId,
                },
                update: {},
            }),
        ]);
        suppliersByOrg.push(sups);
    }
    console.log(`  ✓ Suppliers: ${suppliersByOrg.flat().length}`);

    // ─── 6. Productos (3 por org, con categoría) ──────────────────────────
    const productNames = [
        ['Arroz 1kg', 'Gaseosa 400ml', 'Aceite 900ml'],
        ['Leche 1L', 'Jabón Barra', 'Queso 250g'],
        ['Pan Baguette', 'Fríjol 500g', 'Harina 1kg'],
        ['Pollo entero', 'Tomate kg', 'Cebolla kg'],
        ['Papas fritas', 'Detergente 1L', 'Cloro 1L'],
    ];
    const productsByOrg: { id: string; organizationId: string }[][] = [];
    for (let o = 0; o < organizations.length; o++) {
        const orgId = organizations[o].id;
        const prods = await Promise.all(
            productNames[o].map((name, idx) =>
                prisma.product.upsert({
                    where: {
                        name_organizationId: { name, organizationId: orgId },
                    },
                    create: {
                        internalCode: `SEED-${o + 1}-${String(idx + 1).padStart(3, '0')}`,
                        name,
                        description: `Producto ${name} - Org ${o + 1}`,
                        salePrice: (idx + 1) * 3500,
                        costPrice: (idx + 1) * 2000,
                        unitOfMeasure: '94',
                        taxType: idx === 0 ? 'IVA' : 'EXCLUIDO',
                        taxPercentage: idx === 0 ? 19 : 0,
                        stock: 100 + idx * 20,
                        minStock: 10,
                        isActive: true,
                        categoryId: categoriesByOrg[o][idx % categoriesByOrg[o].length].id,
                        organizationId: orgId,
                    },
                    update: {},
                })
            )
        );
        productsByOrg.push(prods);
    }
    console.log(`  ✓ Products: ${productsByOrg.flat().length}`);

    // ─── 7. ProductTax (impuesto adicional en el 2º producto de cada org) ───
    for (let o = 0; o < organizations.length; o++) {
        const product = productsByOrg[o][1];
        const existing = await prisma.productTax.findFirst({
            where: { productId: product.id, taxType: 'IC' },
        });
        if (!existing) {
            await prisma.productTax.create({
                data: {
                    productId: product.id,
                    taxType: 'IC',
                    percentage: 8,
                    fixedAmount: null,
                },
            });
        }
    }
    console.log(`  ✓ ProductTax: ${organizations.length} (IC 8% en 2º producto por org)`);

    // ─── 8. Resoluciones de factura (1 por org) ─────────────────────────────
    const resolutionsByOrg: { id: string }[] = [];
    for (let o = 0; o < organizations.length; o++) {
        const orgId = organizations[o].id;
        let r = await prisma.invoiceResolution.findFirst({
            where: { organizationId: orgId, prefix: 'TICK' },
        });
        if (!r) {
            r = await prisma.invoiceResolution.create({
                data: {
                    name: `Tickets caja Org ${o + 1}`,
                    prefix: 'TICK',
                    rangeStart: 1,
                    rangeEnd: 99999,
                    currentNumber: 1,
                    isActive: true,
                    organizationId: orgId,
                },
            });
        }
        resolutionsByOrg.push(r);
    }
    console.log(`  ✓ InvoiceResolutions: ${resolutionsByOrg.length}`);

    // ─── 9. CashSession (1 abierta por org) ────────────────────────────────
    const cashSessionsByOrg: { id: string }[] = [];
    for (let o = 0; o < organizations.length; o++) {
        const cs = await prisma.cashSession.create({
            data: {
                openingAmount: 150000,
                isClosed: false,
                userId: users[o].id,
                organizationId: organizations[o].id,
            },
        });
        cashSessionsByOrg.push(cs);
    }
    console.log(`  ✓ CashSessions: ${cashSessionsByOrg.length}`);

    // ─── 10. Gastos (2 por org) ───────────────────────────────────────────
    for (let o = 0; o < organizations.length; o++) {
        await prisma.expense.createMany({
            data: [
                {
                    category: 'SERVICIOS_PUBLICOS',
                    description: 'Energía y agua',
                    amount: 250000,
                    organizationId: organizations[o].id,
                },
                {
                    category: 'TRANSPORTE',
                    description: 'Flete proveedor',
                    amount: 45000,
                    organizationId: organizations[o].id,
                },
            ],
        });
    }
    console.log(`  ✓ Expenses: ${organizations.length * 2}`);

    // ─── 11. Compras con ítems y movimientos de stock ──────────────────────
    const purchasesByOrg: { id: string }[] = [];
    for (let o = 0; o < organizations.length; o++) {
        const orgId = organizations[o].id;
        const supplier = suppliersByOrg[o][0];
        const prods = productsByOrg[o];
        const p1 = prods[0];
        const p2 = prods[1];
        const total = 120000;
        const purchase = await prisma.purchase.create({
            data: {
                supplierId: supplier.id,
                organizationId: orgId,
                purchaseDate: new Date(),
                reference: `COMP-SEED-${o + 1}`,
                total,
                items: {
                    create: [
                        { productId: p1.id, quantity: 20, unitCost: 2000, subtotal: 40000 },
                        { productId: p2.id, quantity: 25, unitCost: 3200, subtotal: 80000 },
                    ],
                },
            },
        });
        purchasesByOrg.push(purchase);
        // Stock movements: antes de la compra el stock era menor; después se suma.
        const stock1 = (await prisma.product.findUnique({ where: { id: p1.id }, select: { stock: true } }))?.stock ?? 0;
        const stock2 = (await prisma.product.findUnique({ where: { id: p2.id }, select: { stock: true } }))?.stock ?? 0;
        await prisma.stockMovement.createMany({
            data: [
                {
                    type: 'COMPRA',
                    quantity: 20,
                    previousStock: stock1 - 20,
                    newStock: stock1,
                    unitCost: 2000,
                    productId: p1.id,
                    supplierId: supplier.id,
                    organizationId: orgId,
                    reference: purchase.id,
                },
                {
                    type: 'COMPRA',
                    quantity: 25,
                    previousStock: stock2 - 25,
                    newStock: stock2,
                    unitCost: 3200,
                    productId: p2.id,
                    supplierId: supplier.id,
                    organizationId: orgId,
                    reference: purchase.id,
                },
            ],
        });
    }
    console.log(`  ✓ Purchases + StockMovements`);

    // ─── 12. Facturas con ítems y pago (1 por org, solo si no existe) ────────
    for (let o = 0; o < organizations.length; o++) {
        const orgId = organizations[o].id;
        const customer = customersByOrg[o][0];
        const resolution = resolutionsByOrg[o];
        const user = users[o];
        const cashSession = cashSessionsByOrg[o];
        const prods = productsByOrg[o];
        const existingInv = await prisma.invoice.findFirst({
            where: { organizationId: orgId, resolutionId: resolution.id },
        });
        if (existingInv) continue;

        const invoiceNumber = `TICK-0001`;
        const subtotal = 15000;
        const taxTotal = 2850;
        const total = 17850;

        await prisma.invoice.create({
            data: {
                type: 'POS',
                invoiceNumber,
                issueDate: new Date(),
                subtotal,
                taxTotal,
                discountTotal: 0,
                total,
                dianStatus: 'NO_APLICA',
                paymentStatus: 'PAGADA',
                customerId: customer.id,
                resolutionId: resolution.id,
                createdByUserId: user.id,
                cashSessionId: cashSession.id,
                organizationId: orgId,
                items: {
                    create: [
                        {
                            productId: prods[0].id,
                            quantity: 2,
                            unitPrice: 5000,
                            discount: 0,
                            taxPercentage: 19,
                            taxAmount: 1900,
                            subtotal: 10000,
                            total: 11900,
                        },
                        {
                            productId: prods[1].id,
                            quantity: 1,
                            unitPrice: 5000,
                            discount: 0,
                            taxPercentage: 0,
                            taxAmount: 0,
                            subtotal: 5000,
                            total: 5000,
                        },
                    ],
                },
                payments: {
                    create: {
                        paymentMethod: 'EFECTIVO',
                        amount: total,
                    },
                },
            },
        });
        await prisma.invoiceResolution.update({
            where: { id: resolution.id },
            data: { currentNumber: 2 },
        });
    }
    console.log(`  ✓ Invoices + Items + Payments`);

    console.log('✅ Seed completado. 5 empresas con usuarios, categorías, clientes, productos, proveedores,');
    console.log('   resoluciones, caja, gastos, compras, movimientos de stock, facturas y product taxes.');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
