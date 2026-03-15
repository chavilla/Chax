import { Router } from 'express';
import { InvoiceResolutionController } from '../controllers/InvoiceResolutionController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import {
    CreateInvoiceResolutionSchema,
    UpdateInvoiceResolutionSchema,
    GetInvoiceResolutionsSchema,
    GetInvoiceResolutionSchema,
} from '../dtos/invoiceResolution.dtos';

export function createInvoiceResolutionRouter(controller: InvoiceResolutionController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetInvoiceResolutionsSchema),
        handleAsync((req, res) => controller.getResolutions(req, res))
    );
    router.get(
        '/:id',
        validateRequest(GetInvoiceResolutionSchema),
        handleAsync((req, res) => controller.getById(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateInvoiceResolutionSchema),
        handleAsync((req, res) => controller.create(req, res))
    );
    router.put(
        '/:id',
        validateRequest(UpdateInvoiceResolutionSchema),
        handleAsync((req, res) => controller.update(req, res))
    );
    return router;
}
