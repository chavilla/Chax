import { Router } from 'express';
import { CashSessionController } from '../controllers/CashSessionController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import {
    CreateCashSessionSchema,
    CloseCashSessionSchema,
    GetCashSessionSchema,
    GetCashSessionsSchema,
} from '../dtos/cashSession.dtos';

export function createCashSessionRouter(controller: CashSessionController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetCashSessionsSchema),
        handleAsync((req, res) => controller.getSessions(req, res))
    );
    router.get(
        '/:id',
        validateRequest(GetCashSessionSchema),
        handleAsync((req, res) => controller.getById(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateCashSessionSchema),
        handleAsync((req, res) => controller.create(req, res))
    );
    router.patch(
        '/:id/close',
        validateRequest(CloseCashSessionSchema),
        handleAsync((req, res) => controller.close(req, res))
    );
    return router;
}
