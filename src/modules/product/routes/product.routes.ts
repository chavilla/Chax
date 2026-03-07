import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
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
        (request, response) => productController.getProducts(request, response)
    );
    router.post(
        '/',
        validateRequest(CreateProductSchema),
        (request, response) => productController.create(request, response)
    );
    router.put(
        '/:id',
        validateRequest(UpdateProductSchema),
        (request, response) => productController.update(request, response)
    );
    router.delete(
        '/:id',
        validateRequest(DeleteProductSchema),
        (request, response) => productController.delete(request, response)
    );
    return router;
}
