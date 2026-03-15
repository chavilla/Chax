import { Router } from 'express';
import { PurchaseController } from '../controllers/PurchaseController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import { CreatePurchaseSchema, GetPurchaseSchema, GetPurchasesSchema } from '../dtos/purchase.dtos';

export function createPurchaseRouter(controller: PurchaseController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetPurchasesSchema),
        handleAsync((req, res) => controller.getPurchases(req, res))
    );
    router.get(
        '/:id',
        validateRequest(GetPurchaseSchema),
        handleAsync((req, res) => controller.getById(req, res))
    );
    router.post(
        '/',
        validateRequest(CreatePurchaseSchema),
        handleAsync((req, res) => controller.create(req, res))
    );
    return router;
}
