import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { CreateUserSchema, UpdateUserSchema, GetUserSchema, GetUsersSchema, GetAllUsersSchema } from '../dtos/user.dtos';

export function createUserRouter(userController: UserController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetUsersSchema),
        (request, response) => userController.getUsers(request, response)
    );
    router.get(
        '/all',
        validateRequest(GetAllUsersSchema),
        (request, response) => userController.getAllUsers(request, response)
    );
    router.get(
        '/:id',
        validateRequest(GetUserSchema),
        (request, response) => userController.getById(request, response)
    );
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
