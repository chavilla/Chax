import { Router } from 'express';
import { DianLogController } from '../controllers/DianLogController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import {
    GetDianLogSchema,
    GetByInvoiceSchema,
    GetByOrganizationSchema,
} from '../dtos/dianLog.dtos';

export function createDianLogRouter(controller: DianLogController): Router {
    const router = Router();
    router.get(
        '/',
        (req, res, next) => {
            if (req.query.invoiceId) {
                return validateRequest(GetByInvoiceSchema)(req, res, next);
            }
            return validateRequest(GetByOrganizationSchema)(req, res, next);
        },
        handleAsync((req, res) =>
            req.query.invoiceId
                ? controller.getByInvoice(req, res)
                : controller.getByOrganization(req, res)
        )
    );
    router.get(
        '/:id',
        validateRequest(GetDianLogSchema),
        handleAsync((req, res) => controller.getById(req, res))
    );
    return router;
}
