import { Router } from 'express';
import { CashSessionController } from '../controllers/CashSessionController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
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
        (req, res) => controller.getSessions(req, res)
    );
    router.get(
        '/:id',
        validateRequest(GetCashSessionSchema),
        (req, res) => controller.getById(req, res)
    );
    router.post(
        '/',
        validateRequest(CreateCashSessionSchema),
        (req, res) => controller.create(req, res)
    );
    router.patch(
        '/:id/close',
        validateRequest(CloseCashSessionSchema),
        (req, res) => controller.close(req, res)
    );
    return router;
}
