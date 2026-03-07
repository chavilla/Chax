import { z } from 'zod';
import { TaxRegime } from '@prisma/client';

// --- Schemas (fuente única de verdad para forma y validación) ---

const organizationBodyFields = {
    nit: z.string().min(3, 'NIT is required and must be at least 3 characters'),
    dv: z.string().optional(),
    businessName: z.string().min(2, 'Business Name is required'),
    tradeName: z.string().optional(),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(3, 'City is required'),
    department: z.string().min(3, 'Department is required'),
    phone: z.string().optional(),
    email: z.string().email('Invalid email address'),
    economicActivityCode: z.string().optional(),
    taxRegime: z.nativeEnum(TaxRegime).optional(),
    /** true = facturación electrónica DIAN; false = solo POS (punto de venta) */
    usesDian: z.boolean().optional(),
    logoUrl: z.string().url('Must be a valid URL').optional(),
};

const createBodySchema = z.object(organizationBodyFields);
const updateBodySchema = createBodySchema.partial();

export const CreateOrganizationSchema = z.object({
    body: createBodySchema,
});

export const UpdateOrganizationSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid organization ID'),
    }),
    body: updateBodySchema,
});

// --- DTOs (tipos inferidos desde los schemas, sin duplicar campos) ---

export type CreateOrganizationDTO = z.infer<typeof createBodySchema>;

export type UpdateOrganizationDTO = { id: string } & z.infer<typeof updateBodySchema>;
