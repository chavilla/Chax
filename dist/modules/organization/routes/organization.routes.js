"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganizationRouter = createOrganizationRouter;
const express_1 = require("express");
const validateRequest_1 = require("../../../shared/middlewares/validateRequest");
const organization_dtos_1 = require("../dtos/organization.dtos");
function createOrganizationRouter(organizationController) {
    const router = (0, express_1.Router)();
    router.get('/', (request, response) => organizationController.getOrganizations(request, response));
    router.post('/', (0, validateRequest_1.validateRequest)(organization_dtos_1.CreateOrganizationSchema), (request, response) => organizationController.create(request, response));
    router.put('/:id', (0, validateRequest_1.validateRequest)(organization_dtos_1.UpdateOrganizationSchema), (request, response) => organizationController.update(request, response));
    return router;
}
