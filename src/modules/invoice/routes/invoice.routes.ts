import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { CreateInvoiceSchema, GetInvoiceSchema, GetInvoicesSchema } from '../dtos/invoice.dtos';

export function createInvoiceRouter(controller: InvoiceController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetInvoicesSchema),
        (req, res) => controller.getInvoices(req, res)
    );
    router.get(
        '/:id',
        validateRequest(GetInvoiceSchema),
        (req, res) => controller.getById(req, res)
    );
    router.post(
        '/',
        validateRequest(CreateInvoiceSchema),
        (req, res) => controller.create(req, res)
    );
    return router;
}
