import { z } from 'zod';

const categoryBodyFields = {
    name: z.string().min(2, 'Name is required'),
    description: z.string().optional(),
    organizationId: z.string().uuid('Invalid organization ID'),
};

const createBodySchema = z.object(categoryBodyFields);
const updateBodySchema = z.object(categoryBodyFields).partial();

export const CreateCategorySchema = z.object({
    body: createBodySchema,
});

export const UpdateCategorySchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid category ID'),
    }),
    body: updateBodySchema,
});

export const GetCategoriesSchema = z.object({
    query: z.object({
        organizationId: z.string().uuid('organizationId must be a valid UUID'),
    }),
});

export type CreateCategoryDTO = z.infer<typeof createBodySchema>;
export type UpdateCategoryDTO = { id: string } & z.infer<typeof updateBodySchema>;
