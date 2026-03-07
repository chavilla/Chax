"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProductSchema = exports.GetProductsSchema = exports.UpdateProductSchema = exports.CreateProductSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const decimalSchema = zod_1.z.number().min(0, 'El valor no puede ser negativo');
const productBodyFields = {
    internalCode: zod_1.z.string().min(1, 'El código interno es requerido').optional(),
    internalCodePrefix: zod_1.z
        .string()
        .max(10, 'El prefijo no puede exceder 10 caracteres')
        .regex(/^[A-Za-z0-9]*$/, 'El prefijo solo puede contener letras y números')
        .optional(),
    barcode: zod_1.z.string().optional().nullable(),
    name: zod_1.z.string().min(2, 'El nombre es requerido'),
    description: zod_1.z.string().optional().nullable(),
    salePrice: decimalSchema,
    costPrice: decimalSchema.optional(), // opcional al crear (default 0); útil para margen e inventario
    unitOfMeasure: zod_1.z.string().optional(),
    taxType: zod_1.z.nativeEnum(client_1.TaxType).optional(),
    taxPercentage: zod_1.z.number().min(0).max(100).optional(),
    stock: zod_1.z.number().int().min(0).optional(),
    minStock: zod_1.z.number().int().min(0).optional(),
    isActive: zod_1.z.boolean().optional(),
    categoryId: zod_1.z.string().uuid('Invalid category ID').optional().nullable(),
    organizationId: zod_1.z.string().uuid('Invalid organization ID'),
};
const createBodySchema = zod_1.z.object(productBodyFields);
const updateBodySchema = zod_1.z.object(productBodyFields).partial();
exports.CreateProductSchema = zod_1.z.object({
    body: createBodySchema,
});
exports.UpdateProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid product ID'),
    }),
    body: updateBodySchema,
});
exports.GetProductsSchema = zod_1.z.object({
    query: zod_1.z.object({
        organizationId: zod_1.z.string().uuid('organizationId must be a valid UUID'),
    }),
});
exports.DeleteProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid product ID'),
    }),
    query: zod_1.z.object({
        organizationId: zod_1.z.string().uuid('organizationId must be a valid UUID'),
    }),
});
