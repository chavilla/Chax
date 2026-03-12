import 'reflect-metadata';
import express from 'express';
import { container } from '../container';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/health', container.healthRouter);
app.use('/api/organizations', container.organizationRouter);
app.use('/api/users', container.userRouter);
app.use('/api/categories', container.categoryRouter);
app.use('/api/customers', container.customerRouter);
app.use('/api/products', container.productRouter);
app.use('/api/suppliers', container.supplierRouter);
app.use('/api/invoice-resolutions', container.invoiceResolutionRouter);
app.use('/api/invoices', container.invoiceRouter);
app.use('/api/cash-sessions', container.cashSessionRouter);

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
