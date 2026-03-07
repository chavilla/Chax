"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerRouter = createCustomerRouter;
const express_1 = require("express");
const validateRequest_1 = require("../../../shared/middlewares/validateRequest");
const customer_dtos_1 = require("../dtos/customer.dtos");
function createCustomerRouter(customerController) {
    const router = (0, express_1.Router)();
    router.get('/', (0, validateRequest_1.validateRequest)(customer_dtos_1.GetCustomersSchema), (request, response) => customerController.getCustomers(request, response));
    router.post('/', (0, validateRequest_1.validateRequest)(customer_dtos_1.CreateCustomerSchema), (request, response) => customerController.create(request, response));
    router.put('/:id', (0, validateRequest_1.validateRequest)(customer_dtos_1.UpdateCustomerSchema), (request, response) => customerController.update(request, response));
    return router;
}
