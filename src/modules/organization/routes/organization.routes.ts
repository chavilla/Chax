import { Router } from 'express';
import { OrganizationController } from '../controllers/OrganizationController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import {
    CreateOrganizationSchema,
    UpdateOrganizationSchema,
} from '../dtos/organization.dtos';

export function createOrganizationRouter(organizationController: OrganizationController): Router {
    const router = Router();
    router.get('/', (request, response) => organizationController.getOrganizations(request, response));
    router.post(
        '/',
        validateRequest(CreateOrganizationSchema),
        (request, response) => organizationController.create(request, response)
    );
    router.put(
        '/:id',
        validateRequest(UpdateOrganizationSchema),
        (request, response) => organizationController.update(request, response)
    );
    return router;
}
