import { Router } from 'express';
import { InvoiceItemTaxController } from '../controllers/InvoiceItemTaxController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import {
    CreateInvoiceItemTaxSchema,
    GetInvoiceItemTaxSchema,
    GetByInvoiceItemSchema,
    DeleteInvoiceItemTaxSchema,
} from '../dtos/invoiceItemTax.dtos';

export function createInvoiceItemTaxRouter(controller: InvoiceItemTaxController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetByInvoiceItemSchema),
        handleAsync((req, res) => controller.getByInvoiceItem(req, res))
    );
    router.get(
        '/:id',
        validateRequest(GetInvoiceItemTaxSchema),
        handleAsync((req, res) => controller.getById(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateInvoiceItemTaxSchema),
        handleAsync((req, res) => controller.create(req, res))
    );
    router.delete(
        '/:id',
        validateRequest(DeleteInvoiceItemTaxSchema),
        handleAsync((req, res) => controller.delete(req, res))
    );
    return router;
}
