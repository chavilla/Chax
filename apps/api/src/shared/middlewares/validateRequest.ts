import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue, ZodType } from 'zod';

export const validateRequest = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.issues.map((issue: ZodIssue) => ({
                        field: issue.path.map(String).join('.'),
                        message: issue.message,
                    })),
                });
            }
            return res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    };
};
