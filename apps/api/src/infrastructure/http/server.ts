import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { container } from '../container';
import { authMiddleware } from '../../shared/middlewares/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3001';
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json());
app.use(authMiddleware);

app.use('/health', container.healthRouter);
app.use('/api/auth', container.authRouter);
app.use('/api/organizations', container.organizationRouter);
app.use('/api/users', container.userRouter);
app.use('/api/categories', container.categoryRouter);
app.use('/api/customers', container.customerRouter);
app.use('/api/products', container.productRouter);
app.use('/api/product-taxes', container.productTaxRouter);
app.use('/api/suppliers', container.supplierRouter);
app.use('/api/invoice-resolutions', container.invoiceResolutionRouter);
app.use('/api/invoices', container.invoiceRouter);
app.use('/api/invoice-item-taxes', container.invoiceItemTaxRouter);
app.use('/api/dian-logs', container.dianLogRouter);
app.use('/api/audit-logs', container.auditLogRouter);
app.use('/api/cash-sessions', container.cashSessionRouter);
app.use('/api/expenses', container.expenseRouter);
app.use('/api/purchases', container.purchaseRouter);
app.use('/api/stock-movements', container.stockMovementRouter);

async function connectDatabase(): Promise<void> {
    try {
        await container.prisma.$queryRaw`SELECT 1`;
        console.log('DB connected');
    } catch (error) {
        console.error('DB connection failed:', error instanceof Error ? error.message : error);
    }
}

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDatabase();
});

// Ensure Prisma disconnects gracefully
process.on('beforeExit', async () => {
    await container.prisma.$disconnect();
});
