import 'reflect-metadata';
import { container as tsyringeContainer } from 'tsyringe';
import { prisma } from './database/prisma';
import { PrismaDatabaseRepository } from './database/repositories/PrismaDatabaseRepository';
import { HealthController } from './http/controllers/HealthController';
import { createHealthRouter } from './http/routes/healthRoutes';
import { PrismaOrganizationRepository } from '../modules/organization/repositories/PrismaOrganizationRepository';
import { OrganizationController } from '../modules/organization/controllers/OrganizationController';
import { createOrganizationRouter } from '../modules/organization/routes/organization.routes';
import { DatabaseRepositoryToken, OrganizationRepositoryToken } from '../shared/container/tokens';

// Registrar implementaciones para los tokens (interfaces)
tsyringeContainer.register(DatabaseRepositoryToken, { useClass: PrismaDatabaseRepository });
tsyringeContainer.register(OrganizationRepositoryToken, { useClass: PrismaOrganizationRepository });

// Resolver controladores (sus dependencias se inyectan automáticamente)
const healthController = tsyringeContainer.resolve(HealthController);
const organizationController = tsyringeContainer.resolve(OrganizationController);

export const container = {
    healthRouter: createHealthRouter(healthController),
    organizationRouter: createOrganizationRouter(organizationController),
    prisma,
};
