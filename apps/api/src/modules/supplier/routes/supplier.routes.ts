import { Router } from 'express';
import { SupplierController } from '../controllers/SupplierController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
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
        handleAsync((req, res) => supplierController.getSuppliers(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateSupplierSchema),
        handleAsync((req, res) => supplierController.create(req, res))
    );
    router.put(
        '/:id',
        validateRequest(UpdateSupplierSchema),
        handleAsync((req, res) => supplierController.update(req, res))
    );
    return router;
}
