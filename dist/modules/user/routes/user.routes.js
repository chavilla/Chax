"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRouter = createUserRouter;
const express_1 = require("express");
const validateRequest_1 = require("../../../shared/middlewares/validateRequest");
const user_dtos_1 = require("../dtos/user.dtos");
function createUserRouter(userController) {
    const router = (0, express_1.Router)();
    router.post('/', (0, validateRequest_1.validateRequest)(user_dtos_1.CreateUserSchema), (request, response) => userController.create(request, response));
    router.put('/:id', (0, validateRequest_1.validateRequest)(user_dtos_1.UpdateUserSchema), (request, response) => userController.update(request, response));
    return router;
}
