import { Router } from 'express';
import { HealthController } from '../controllers/HealthController';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';

export function createHealthRouter(healthController: HealthController): Router {
    const router = Router();
    router.get('/', handleAsync((req, res) => healthController.check(req, res)));
    return router;
}
