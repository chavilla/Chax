"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// --- Schemas (fuente única de verdad) ---
const userBodyFields = {
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    name: zod_1.z.string().min(2, 'Name is required'),
    role: zod_1.z.nativeEnum(client_1.UserRole).optional(),
    isActive: zod_1.z.boolean().optional(),
    organizationId: zod_1.z.string().uuid('Invalid organization ID').nullable().optional(),
};
const createBodySchema = zod_1.z.object(userBodyFields);
const updateBodySchema = zod_1.z
    .object({
    ...userBodyFields,
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters').optional(),
})
    .partial();
exports.CreateUserSchema = zod_1.z.object({
    body: createBodySchema,
});
exports.UpdateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid('Invalid user ID'),
    }),
    body: updateBodySchema,
});
