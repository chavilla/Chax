import { Router } from 'express';
import { StockMovementController } from '../controllers/StockMovementController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { GetKardexSchema } from '../dtos/stockMovement.dtos';

export function createStockMovementRouter(controller: StockMovementController): Router {
    const router = Router();
    router.get(
        '/kardex',
        validateRequest(GetKardexSchema),
        (req, res) => controller.getKardex(req, res)
    );
    return router;
}
