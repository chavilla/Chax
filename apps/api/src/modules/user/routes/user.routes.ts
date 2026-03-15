import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import { CreateUserSchema, UpdateUserSchema, GetUserSchema, GetUsersSchema, GetAllUsersSchema } from '../dtos/user.dtos';

export function createUserRouter(userController: UserController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetUsersSchema),
        handleAsync((req, res) => userController.getUsers(req, res))
    );
    router.get(
        '/all',
        validateRequest(GetAllUsersSchema),
        handleAsync((req, res) => userController.getAllUsers(req, res))
    );
    router.get(
        '/:id',
        validateRequest(GetUserSchema),
        handleAsync((req, res) => userController.getById(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateUserSchema),
        handleAsync((req, res) => userController.create(req, res))
    );
    router.put(
        '/:id',
        validateRequest(UpdateUserSchema),
        handleAsync((req, res) => userController.update(req, res))
    );
    return router;
}
