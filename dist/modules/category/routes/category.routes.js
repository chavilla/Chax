"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryRouter = createCategoryRouter;
const express_1 = require("express");
const validateRequest_1 = require("../../../shared/middlewares/validateRequest");
const category_dtos_1 = require("../dtos/category.dtos");
function createCategoryRouter(categoryController) {
    const router = (0, express_1.Router)();
    router.post('/', (0, validateRequest_1.validateRequest)(category_dtos_1.CreateCategorySchema), (request, response) => categoryController.create(request, response));
    router.put('/:id', (0, validateRequest_1.validateRequest)(category_dtos_1.UpdateCategorySchema), (request, response) => categoryController.update(request, response));
    return router;
}
