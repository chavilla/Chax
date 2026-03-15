import { Router } from 'express';
import { ProductTaxController } from '../controllers/ProductTaxController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import {
    CreateProductTaxSchema,
    UpdateProductTaxSchema,
    GetProductTaxesByProductSchema,
    GetProductTaxSchema,
    DeleteProductTaxSchema,
} from '../dtos/productTax.dtos';

export function createProductTaxRouter(controller: ProductTaxController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetProductTaxesByProductSchema),
        handleAsync((req, res) => controller.getByProduct(req, res))
    );
    router.get(
        '/:id',
        validateRequest(GetProductTaxSchema),
        handleAsync((req, res) => controller.getById(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateProductTaxSchema),
        handleAsync((req, res) => controller.create(req, res))
    );
    router.put(
        '/:id',
        validateRequest(UpdateProductTaxSchema),
        handleAsync((req, res) => controller.update(req, res))
    );
    router.delete(
        '/:id',
        validateRequest(DeleteProductTaxSchema),
        handleAsync((req, res) => controller.delete(req, res))
    );
    return router;
}
