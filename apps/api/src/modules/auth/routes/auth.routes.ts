import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { LoginSchema } from '../dtos/auth.dtos';

export function createAuthRouter(controller: AuthController): Router {
    const router = Router();

    router.post(
        '/login',
        validateRequest(LoginSchema),
        handleAsync((req, res) => controller.login(req, res))
    );

    router.get(
        '/me',
        handleAsync((req, res) => controller.me(req, res))
    );

    return router;
}
