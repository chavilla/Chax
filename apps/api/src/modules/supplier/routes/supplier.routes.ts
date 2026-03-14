import { Router } from 'express';
import { SupplierController } from '../controllers/SupplierController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import {
    CreateSupplierSchema,
    UpdateSupplierSchema,
    GetSuppliersSchema,
} from '../dtos/supplier.dtos';

export function createSupplierRouter(supplierController: SupplierController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetSuppliersSchema),
        (request, response) => supplierController.getSuppliers(request, response)
    );
    router.post(
        '/',
        validateRequest(CreateSupplierSchema),
        (request, response) => supplierController.create(request, response)
    );
    router.put(
        '/:id',
        validateRequest(UpdateSupplierSchema),
        (request, response) => supplierController.update(request, response)
    );
    return router;
}
