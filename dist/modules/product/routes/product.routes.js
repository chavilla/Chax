"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductRouter = createProductRouter;
const express_1 = require("express");
const validateRequest_1 = require("../../../shared/middlewares/validateRequest");
const product_dtos_1 = require("../dtos/product.dtos");
function createProductRouter(productController) {
    const router = (0, express_1.Router)();
    router.get('/', (0, validateRequest_1.validateRequest)(product_dtos_1.GetProductsSchema), (request, response) => productController.getProducts(request, response));
    router.post('/', (0, validateRequest_1.validateRequest)(product_dtos_1.CreateProductSchema), (request, response) => productController.create(request, response));
    router.put('/:id', (0, validateRequest_1.validateRequest)(product_dtos_1.UpdateProductSchema), (request, response) => productController.update(request, response));
    router.delete('/:id', (0, validateRequest_1.validateRequest)(product_dtos_1.DeleteProductSchema), (request, response) => productController.delete(request, response));
    return router;
}
