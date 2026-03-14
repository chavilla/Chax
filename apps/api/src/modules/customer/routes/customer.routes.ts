import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
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
        (request, response) => customerController.getCustomers(request, response)
    );
    router.post(
        '/',
        validateRequest(CreateCustomerSchema),
        (request, response) => customerController.create(request, response)
    );
    router.put(
        '/:id',
        validateRequest(UpdateCustomerSchema),
        (request, response) => customerController.update(request, response)
    );
    return router;
}
