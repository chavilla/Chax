import { z } from 'zod';
import { UserRole } from '@chax/shared';
import { performedByUserIdSchema } from '../../../shared/schemas/audit';

// --- Schemas (fuente única de verdad) ---

const userBodyFields = {
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(2, 'Name is required'),
    role: z.nativeEnum(UserRole).optional(),
    isActive: z.boolean().optional(),
    organizationId: z.string().uuid('Invalid organization ID').nullable().optional(),
    performedByUserId: performedByUserIdSchema,
};

const createBodySchema = z.object(userBodyFields);

const updateBodySchema = z
    .object({
        ...userBodyFields,
        password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    })
    .partial();

export const CreateUserSchema = z.object({
    body: createBodySchema,
});

export const UpdateUserSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID'),
    }),
    body: updateBodySchema,
});

export const GetUserSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID'),
    }),
});

export const GetUsersSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId debe ser un UUID'),
    }),
});

export const GetAllUsersSchema = z.object({});

// --- DTOs (tipos inferidos) ---

export type CreateUserDTO = z.infer<typeof createBodySchema>;

export type UpdateUserDTO = { id: string } & z.infer<typeof updateBodySchema>;
