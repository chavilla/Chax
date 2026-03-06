import { z } from 'zod';
import { TaxRegime } from '@prisma/client';

// --- DTOs (tipos) ---

export interface CreateOrganizationDTO {
    nit: string;
    dv?: string;
    businessName: string;
    tradeName?: string;
    address: string;
    city: string;
    department: string;
    phone?: string;
    email: string;
    economicActivityCode?: string;
    taxRegime?: TaxRegime;
    /** true = facturación electrónica DIAN; false = solo POS (punto de venta) */
    usesDian?: boolean;
    logoUrl?: string;
}

export interface UpdateOrganizationDTO {
    id: string;
    nit?: string;
    dv?: string;
    businessName?: string;
    tradeName?: string;
    address?: string;
    city?: string;
    department?: string;
    phone?: string;
    email?: string;
    economicActivityCode?: string;
    taxRegime?: TaxRegime;
    /** true = facturación electrónica DIAN; false = solo POS (punto de venta) */
    usesDian?: boolean;
    logoUrl?: string;
}

// --- Schemas (validación Zod) ---

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
    usesDian: z.boolean().optional(),
    logoUrl: z.string().url('Must be a valid URL').optional(),
};

export const CreateOrganizationSchema = z.object({
    body: z.object(organizationBodyFields),
});

export const UpdateOrganizationSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid organization ID'),
    }),
    body: z.object({
        nit: z.string().min(3).optional(),
        dv: z.string().optional(),
        businessName: z.string().min(2).optional(),
        tradeName: z.string().optional(),
        address: z.string().min(5).optional(),
        city: z.string().min(3).optional(),
        department: z.string().min(3).optional(),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        economicActivityCode: z.string().optional(),
        taxRegime: z.nativeEnum(TaxRegime).optional(),
        usesDian: z.boolean().optional(),
        logoUrl: z.string().url().optional(),
    }),
});
