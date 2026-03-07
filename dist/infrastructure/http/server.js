"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const container_1 = require("../container");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use('/health', container_1.container.healthRouter);
app.use('/api/organizations', container_1.container.organizationRouter);
app.use('/api/users', container_1.container.userRouter);
app.use('/api/categories', container_1.container.categoryRouter);
async function connectDatabase() {
    try {
        await container_1.container.prisma.$queryRaw `SELECT 1`;
        console.log('DB connected');
    }
    catch (error) {
        console.error('DB connection failed:', error instanceof Error ? error.message : error);
    }
}
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDatabase();
});
// Ensure Prisma disconnects gracefully
process.on('beforeExit', async () => {
    await container_1.container.prisma.$disconnect();
});
