import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import {
    CreateCustomerSchema,
    UpdateCustomerSchema,
    GetCustomersSchema,
} from '../dtos/customer.dtos';

export function createCustomerRouter(customerController: CustomerController): Router {
    const router = Router();
    router.get(
        '/',
        validateRequest(GetCustomersSchema),
        handleAsync((req, res) => customerController.getCustomers(req, res))
    );
    router.post(
        '/',
        validateRequest(CreateCustomerSchema),
        handleAsync((req, res) => customerController.create(req, res))
    );
    router.put(
        '/:id',
        validateRequest(UpdateCustomerSchema),
        handleAsync((req, res) => customerController.update(req, res))
    );
    return router;
}
