import { Router } from 'express';
import { OrganizationController } from '../controllers/OrganizationController';
import { validateRequest } from '../../../shared/middlewares/validateRequest';
import { handleAsync } from '../../../shared/middlewares/asyncHandler';
import { CreateOrganizationSchema, UpdateOrganizationSchema } from '../dtos/organization.dtos';

export function createOrganizationRouter(organizationController: OrganizationController): Router {
    const router = Router();
    router.get('/', handleAsync((req, res) => organizationController.getOrganizations(req, res)));
    router.post(
        '/',
        validateRequest(CreateOrganizationSchema),
        handleAsync((req, res) => organizationController.create(req, res))
    );
    router.put(
        '/:id',
        validateRequest(UpdateOrganizationSchema),
        handleAsync((req, res) => organizationController.update(req, res))
    );
    return router;
}
