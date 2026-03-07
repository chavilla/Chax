import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { CreateUserSchema, UpdateUserSchema } from '../dtos/user.dtos';

export function createUserRouter(userController: UserController): Router {
    const router = Router();
    router.post(
        '/',
        validateRequest(CreateUserSchema),
        (request, response) => userController.create(request, response)
    );
    router.put(
        '/:id',
        validateRequest(UpdateUserSchema),
        (request, response) => userController.update(request, response)
    );
    return router;
}
