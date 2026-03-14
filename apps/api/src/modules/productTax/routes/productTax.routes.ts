import { Router } from 'express';
import { ProductTaxController } from '../controllers/ProductTaxController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
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
        (req, res) => controller.getByProduct(req, res)
    );
    router.get(
        '/:id',
        validateRequest(GetProductTaxSchema),
        (req, res) => controller.getById(req, res)
    );
    router.post(
        '/',
        validateRequest(CreateProductTaxSchema),
        (req, res) => controller.create(req, res)
    );
    router.put(
        '/:id',
        validateRequest(UpdateProductTaxSchema),
        (req, res) => controller.update(req, res)
    );
    router.delete(
        '/:id',
        validateRequest(DeleteProductTaxSchema),
        (req, res) => controller.delete(req, res)
    );
    return router;
}
