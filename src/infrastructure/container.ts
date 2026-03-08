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
import { PrismaSupplierRepository } from '../modules/supplier/repositories/PrismaSupplierRepository';
import { SupplierController } from '../modules/supplier/controllers/SupplierController';
import { createSupplierRouter } from '../modules/supplier/routes/supplier.routes';
import { PrismaInvoiceResolutionRepository } from '../modules/invoiceResolution/repositories/PrismaInvoiceResolutionRepository';
import { InvoiceResolutionController } from '../modules/invoiceResolution/controllers/InvoiceResolutionController';
import { createInvoiceResolutionRouter } from '../modules/invoiceResolution/routes/invoiceResolution.routes';
import { PrismaInvoiceRepository } from '../modules/invoice/repositories/PrismaInvoiceRepository';
import { InvoiceController } from '../modules/invoice/controllers/InvoiceController';
import { createInvoiceRouter } from '../modules/invoice/routes/invoice.routes';
import {
    DatabaseRepositoryToken,
    OrganizationRepositoryToken,
    UserRepositoryToken,
    CategoryRepositoryToken,
    CustomerRepositoryToken,
    ProductRepositoryToken,
    SupplierRepositoryToken,
    InvoiceResolutionRepositoryToken,
    InvoiceRepositoryToken,
} from '../shared/container/tokens';

// Registrar implementaciones para los tokens (interfaces)
tsyringeContainer.register(DatabaseRepositoryToken, { useClass: PrismaDatabaseRepository });
tsyringeContainer.register(OrganizationRepositoryToken, { useClass: PrismaOrganizationRepository });
tsyringeContainer.register(UserRepositoryToken, { useClass: PrismaUserRepository });
tsyringeContainer.register(CategoryRepositoryToken, { useClass: PrismaCategoryRepository });
tsyringeContainer.register(CustomerRepositoryToken, { useClass: PrismaCustomerRepository });
tsyringeContainer.register(ProductRepositoryToken, { useClass: PrismaProductRepository });
tsyringeContainer.register(SupplierRepositoryToken, { useClass: PrismaSupplierRepository });
tsyringeContainer.register(InvoiceResolutionRepositoryToken, { useClass: PrismaInvoiceResolutionRepository });
tsyringeContainer.register(InvoiceRepositoryToken, { useClass: PrismaInvoiceRepository });

// Resolver controladores (sus dependencias se inyectan automáticamente)
const healthController = tsyringeContainer.resolve(HealthController);
const organizationController = tsyringeContainer.resolve(OrganizationController);
const userController = tsyringeContainer.resolve(UserController);
const categoryController = tsyringeContainer.resolve(CategoryController);
const customerController = tsyringeContainer.resolve(CustomerController);
const productController = tsyringeContainer.resolve(ProductController);
const supplierController = tsyringeContainer.resolve(SupplierController);
const invoiceResolutionController = tsyringeContainer.resolve(InvoiceResolutionController);
const invoiceController = tsyringeContainer.resolve(InvoiceController);

export const container = {
    healthRouter: createHealthRouter(healthController),
    organizationRouter: createOrganizationRouter(organizationController),
    userRouter: createUserRouter(userController),
    categoryRouter: createCategoryRouter(categoryController),
    customerRouter: createCustomerRouter(customerController),
    productRouter: createProductRouter(productController),
    supplierRouter: createSupplierRouter(supplierController),
    invoiceResolutionRouter: createInvoiceResolutionRouter(invoiceResolutionController),
    invoiceRouter: createInvoiceRouter(invoiceController),
    prisma,
};
