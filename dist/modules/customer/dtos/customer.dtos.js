"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCustomersSchema = exports.UpdateCustomerSchema = exports.CreateCustomerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const idNumberSchema = zod_1.z
    .string()
    .min(5, 'El número de documento debe tener al menos 5 caracteres')
    .max(20, 'El número de documento no puede exceder 20 caracteres');
const nameSchema = zod_1.z
    .string()
    .min(5, 'El nombre debe tener al menos 5 caracteres')
    .refine((val) => val.trim().split(/\s+/).filter(Boolean).length >= 2, 'Debe incluir al menos nombre y apellido');
const customerBodyFields = {
    idType: zod_1.z.nativeEnum(client_1.IdType).optional(),
    idNumber: idNumberSchema,
    dv: zod_1.z.string().optional(),
    name: nameSchema,
    email: zod_1.z.string().email('Invalid email').optional().nullable(),
    phone: zod_1.z.string().optional().nullable(),
    address: zod_1.z.string().optional().nullable(),
    city: zod_1.z.string().optional().nullable(),
    department: zod_1.z.string().optional().nullable(),
    taxRegime: zod_1.z.nativeEnum(client_1.TaxRegime).optional(),
    fiscalResponsibilities: zod_1.z.string().optional().nullable(),
    organizationId: zod_1.z.string().uuid('Invalid organization ID'),
};
const createBodySchema = zod_1.z.object(customerBodyFields);
const updateBodySchema = zod_1.z.object(customerBodyFields).partial();
exports.CreateCustomerSchema = zod_1.z.object({
    body: createBodySchema,
});
exports.UpdateCustomerSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid customer ID'),
    }),
    body: updateBodySchema,
});
exports.GetCustomersSchema = zod_1.z.object({
    query: zod_1.z.object({
        organizationId: zod_1.z.string().uuid('organizationId must be a valid UUID'),
    }),
});
