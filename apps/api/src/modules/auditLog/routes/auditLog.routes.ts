import { Router } from 'express';
import { AuditLogController } from '../controllers/AuditLogController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import { GetAuditLogSchema, GetByOrganizationSchema } from '../dtos/auditLog.dtos';

export function createAuditLogRouter(controller: AuditLogController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetByOrganizationSchema),
        handleAsync((req, res) => controller.getByOrganization(req, res))
    );
    router.get(
        '/:id',
        validateRequest(GetAuditLogSchema),
        handleAsync((req, res) => controller.getById(req, res))
    );
    return router;
}
