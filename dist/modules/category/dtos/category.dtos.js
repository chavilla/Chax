"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoriesSchema = exports.UpdateCategorySchema = exports.CreateCategorySchema = void 0;
const zod_1 = require("zod");
const categoryBodyFields = {
    name: zod_1.z.string().min(2, 'Name is required'),
    description: zod_1.z.string().optional(),
    organizationId: zod_1.z.string().uuid('Invalid organization ID'),
};
const createBodySchema = zod_1.z.object(categoryBodyFields);
const updateBodySchema = zod_1.z.object(categoryBodyFields).partial();
exports.CreateCategorySchema = zod_1.z.object({
    body: createBodySchema,
});
exports.UpdateCategorySchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid category ID'),
    }),
    body: updateBodySchema,
});
exports.GetCategoriesSchema = zod_1.z.object({
    query: zod_1.z.object({
        organizationId: zod_1.z.string().uuid('organizationId must be a valid UUID'),
    }),
});
