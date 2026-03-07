"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaProductRepository = void 0;
const tsyringe_1 = require("tsyringe");
const Product_1 = require("../domain/entities/Product");
const prisma_1 = require("../../../infrastructure/database/prisma");
let PrismaProductRepository = class PrismaProductRepository {
    async getNextSequenceForPrefix(organizationId, prefix) {
        const prefixWithDash = `${prefix}-`;
        const products = await prisma_1.prisma.product.findMany({
            where: {
                organizationId,
                internalCode: { startsWith: prefixWithDash },
            },
            select: { internalCode: true },
        });
        const numbers = products
            .map((p) => {
            const part = p.internalCode.slice(prefixWithDash.length);
            const num = parseInt(part, 10);
            return Number.isNaN(num) ? 0 : num;
        })
            .filter((n) => n >= 0);
        const max = numbers.length > 0 ? Math.max(...numbers) : 0;
        return max + 1;
    }
    async existsByInternalCodeAndOrganization(organizationId, internalCode, excludeId) {
        const existing = await prisma_1.prisma.product.findFirst({
            where: {
                organizationId,
                internalCode,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }
    async existsByBarcodeAndOrganization(organizationId, barcode, excludeId) {
        const existing = await prisma_1.prisma.product.findFirst({
            where: {
                organizationId,
                barcode,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }
    async existsByNameAndOrganization(organizationId, name, excludeId) {
        const existing = await prisma_1.prisma.product.findFirst({
            where: {
                organizationId,
                name,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }
    async save(product) {
        const data = {
            id: product.id,
            internalCode: product.props.internalCode,
            barcode: product.props.barcode ?? null,
            name: product.props.name,
            description: product.props.description ?? null,
            salePrice: product.props.salePrice,
            costPrice: product.props.costPrice,
            unitOfMeasure: product.props.unitOfMeasure,
            taxType: product.props.taxType,
            taxPercentage: product.props.taxPercentage,
            stock: product.props.stock,
            minStock: product.props.minStock,
            isActive: product.props.isActive,
            categoryId: product.props.categoryId ?? null,
            organizationId: product.props.organizationId,
        };
        await prisma_1.prisma.product.upsert({
            where: { id: product.id },
            update: data,
            create: data,
        });
    }
    async findById(id) {
        const prismaProduct = await prisma_1.prisma.product.findUnique({
            where: { id },
        });
        if (!prismaProduct)
            return null;
        return this.mapToDomain(prismaProduct);
    }
    async findAllByOrganization(organizationId) {
        const list = await prisma_1.prisma.product.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });
        return list.map((p) => this.mapToDomain(p));
    }
    async countDependencies(productId) {
        const [invoiceItems, stockMovements] = await Promise.all([
            prisma_1.prisma.invoiceItem.count({ where: { productId } }),
            prisma_1.prisma.stockMovement.count({ where: { productId } }),
        ]);
        return { invoiceItems, stockMovements };
    }
    async delete(id) {
        await prisma_1.prisma.product.delete({
            where: { id },
        });
    }
    mapToDomain(prismaProduct) {
        const props = {
            internalCode: prismaProduct.internalCode,
            barcode: prismaProduct.barcode ?? undefined,
            name: prismaProduct.name,
            description: prismaProduct.description ?? undefined,
            salePrice: Number(prismaProduct.salePrice),
            costPrice: Number(prismaProduct.costPrice),
            unitOfMeasure: prismaProduct.unitOfMeasure,
            taxType: prismaProduct.taxType,
            taxPercentage: Number(prismaProduct.taxPercentage),
            stock: prismaProduct.stock,
            minStock: prismaProduct.minStock,
            isActive: prismaProduct.isActive,
            categoryId: prismaProduct.categoryId ?? undefined,
            organizationId: prismaProduct.organizationId,
            createdAt: prismaProduct.createdAt,
            updatedAt: prismaProduct.updatedAt,
        };
        return Product_1.Product.create(props, prismaProduct.id);
    }
};
exports.PrismaProductRepository = PrismaProductRepository;
exports.PrismaProductRepository = PrismaProductRepository = __decorate([
    (0, tsyringe_1.injectable)()
], PrismaProductRepository);
