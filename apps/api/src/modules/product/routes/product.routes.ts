import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import {
    CreateProductSchema,
    UpdateProductSchema,
    GetProductsSchema,
    DeleteProductSchema,
} from '../dtos/product.dtos';

export function createProductRouter(productController: ProductController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetProductsSchema),
        handleAsync((req, res) => productController.getProducts(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateProductSchema),
        handleAsync((req, res) => productController.create(req, res))
    );
    router.put(
        '/:id',
        validateRequest(UpdateProductSchema),
        handleAsync((req, res) => productController.update(req, res))
    );
    router.delete(
        '/:id',
        validateRequest(DeleteProductSchema),
        handleAsync((req, res) => productController.delete(req, res))
    );
    return router;
}
