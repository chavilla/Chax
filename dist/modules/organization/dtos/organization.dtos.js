"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOrganizationSchema = exports.CreateOrganizationSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// --- Schemas (fuente única de verdad para forma y validación) ---
const organizationBodyFields = {
    nit: zod_1.z.string().min(3, 'NIT is required and must be at least 3 characters'),
    dv: zod_1.z.string().optional(),
    businessName: zod_1.z.string().min(2, 'Business Name is required'),
    tradeName: zod_1.z.string().optional(),
    address: zod_1.z.string().min(5, 'Address is required'),
    city: zod_1.z.string().min(3, 'City is required'),
    department: zod_1.z.string().min(3, 'Department is required'),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email('Invalid email address'),
    economicActivityCode: zod_1.z.string().optional(),
    taxRegime: zod_1.z.nativeEnum(client_1.TaxRegime).optional(),
    /** true = facturación electrónica DIAN; false = solo POS (punto de venta) */
    usesDian: zod_1.z.boolean().optional(),
    logoUrl: zod_1.z.string().url('Must be a valid URL').optional(),
};
const createBodySchema = zod_1.z.object(organizationBodyFields);
const updateBodySchema = createBodySchema.partial();
exports.CreateOrganizationSchema = zod_1.z.object({
    body: createBodySchema,
});
exports.UpdateOrganizationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid organization ID'),
    }),
    body: updateBodySchema,
});
