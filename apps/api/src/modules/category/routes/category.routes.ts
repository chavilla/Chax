import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
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
        (request, response) => categoryController.getCategories(request, response)
    );
    router.post(
        '/',
        validateRequest(CreateCategorySchema),
        (request, response) => categoryController.create(request, response)
    );
    router.put(
        '/:id',
        validateRequest(UpdateCategorySchema),
        (request, response) => categoryController.update(request, response)
    );
    return router;
}
