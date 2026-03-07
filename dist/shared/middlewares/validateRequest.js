"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.issues.map((issue) => ({
                        field: issue.path.map(String).join('.'),
                        message: issue.message,
                    })),
                });
            }
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    };
};
exports.validateRequest = validateRequest;
