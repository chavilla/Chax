import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import {
    CreateCategorySchema,
    UpdateCategorySchema,
    GetCategoriesSchema,
} from '../dtos/category.dtos';

export function createCategoryRouter(categoryController: CategoryController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetCategoriesSchema),
        handleAsync((req, res) => categoryController.getCategories(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateCategorySchema),
        handleAsync((req, res) => categoryController.create(req, res))
    );
    router.put(
        '/:id',
        validateRequest(UpdateCategorySchema),
        handleAsync((req, res) => categoryController.update(req, res))
    );
    return router;
}
