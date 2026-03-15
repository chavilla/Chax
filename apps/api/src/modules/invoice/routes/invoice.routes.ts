import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import {
    CreateInvoiceSchema,
    GetInvoiceSchema,
    GetInvoicesSchema,
    RegisterPaymentSchema,
} from '../dtos/invoice.dtos';

export function createInvoiceRouter(controller: InvoiceController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetInvoicesSchema),
        handleAsync((req, res) => controller.getInvoices(req, res))
    );
    router.get(
        '/:id',
        validateRequest(GetInvoiceSchema),
        handleAsync((req, res) => controller.getById(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateInvoiceSchema),
        handleAsync((req, res) => controller.create(req, res))
    );
    router.post(
        '/:id/payments',
        validateRequest(RegisterPaymentSchema),
        handleAsync((req, res) => controller.addPayment(req, res))
    );
    return router;
}
