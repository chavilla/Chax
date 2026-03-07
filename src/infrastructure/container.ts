import 'reflect-metadata';
import { container as tsyringeContainer } from 'tsyringe';
import { prisma } from './database/prisma';
import { PrismaDatabaseRepository } from './database/repositories/PrismaDatabaseRepository';
import { HealthController } from './http/controllers/HealthController';
import { createHealthRouter } from './http/routes/healthRoutes';
import { PrismaOrganizationRepository } from '../modules/organization/repositories/PrismaOrganizationRepository';
import { OrganizationController } from '../modules/organization/controllers/OrganizationController';
import { createOrganizationRouter } from '../modules/organization/routes/organization.routes';
import { PrismaUserRepository } from '../modules/user/repositories/PrismaUserRepository';
import { UserController } from '../modules/user/controllers/UserController';
import { createUserRouter } from '../modules/user/routes/user.routes';
import { PrismaCategoryRepository } from '../modules/category/repositories/PrismaCategoryRepository';
import { CategoryController } from '../modules/category/controllers/CategoryController';
import { createCategoryRouter } from '../modules/category/routes/category.routes';
import { PrismaCustomerRepository } from '../modules/customer/repositories/PrismaCustomerRepository';
import { CustomerController } from '../modules/customer/controllers/CustomerController';
import { createCustomerRouter } from '../modules/customer/routes/customer.routes';
import { PrismaProductRepository } from '../modules/product/repositories/PrismaProductRepository';
import { ProductController } from '../modules/product/controllers/ProductController';
import { createProductRouter } from '../modules/product/routes/product.routes';
import {
    DatabaseRepositoryToken,
    OrganizationRepositoryToken,
    UserRepositoryToken,
    CategoryRepositoryToken,
    CustomerRepositoryToken,
    ProductRepositoryToken,
} from '../shared/container/tokens';

// Registrar implementaciones para los tokens (interfaces)
tsyringeContainer.register(DatabaseRepositoryToken, { useClass: PrismaDatabaseRepository });
tsyringeContainer.register(OrganizationRepositoryToken, { useClass: PrismaOrganizationRepository });
tsyringeContainer.register(UserRepositoryToken, { useClass: PrismaUserRepository });
tsyringeContainer.register(CategoryRepositoryToken, { useClass: PrismaCategoryRepository });
tsyringeContainer.register(CustomerRepositoryToken, { useClass: PrismaCustomerRepository });
tsyringeContainer.register(ProductRepositoryToken, { useClass: PrismaProductRepository });

// Resolver controladores (sus dependencias se inyectan automáticamente)
const healthController = tsyringeContainer.resolve(HealthController);
const organizationController = tsyringeContainer.resolve(OrganizationController);
const userController = tsyringeContainer.resolve(UserController);
const categoryController = tsyringeContainer.resolve(CategoryController);
const customerController = tsyringeContainer.resolve(CustomerController);
const productController = tsyringeContainer.resolve(ProductController);

export const container = {
    healthRouter: createHealthRouter(healthController),
    organizationRouter: createOrganizationRouter(organizationController),
    userRouter: createUserRouter(userController),
    categoryRouter: createCategoryRouter(categoryController),
    customerRouter: createCustomerRouter(customerController),
    productRouter: createProductRouter(productController),
    prisma,
};
