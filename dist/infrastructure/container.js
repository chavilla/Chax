"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const prisma_1 = require("./database/prisma");
const PrismaDatabaseRepository_1 = require("./database/repositories/PrismaDatabaseRepository");
const HealthController_1 = require("./http/controllers/HealthController");
const healthRoutes_1 = require("./http/routes/healthRoutes");
const PrismaOrganizationRepository_1 = require("../modules/organization/repositories/PrismaOrganizationRepository");
const OrganizationController_1 = require("../modules/organization/controllers/OrganizationController");
const organization_routes_1 = require("../modules/organization/routes/organization.routes");
const PrismaUserRepository_1 = require("../modules/user/repositories/PrismaUserRepository");
const UserController_1 = require("../modules/user/controllers/UserController");
const user_routes_1 = require("../modules/user/routes/user.routes");
const PrismaCategoryRepository_1 = require("../modules/category/repositories/PrismaCategoryRepository");
const CategoryController_1 = require("../modules/category/controllers/CategoryController");
const category_routes_1 = require("../modules/category/routes/category.routes");
const PrismaCustomerRepository_1 = require("../modules/customer/repositories/PrismaCustomerRepository");
const CustomerController_1 = require("../modules/customer/controllers/CustomerController");
const customer_routes_1 = require("../modules/customer/routes/customer.routes");
const PrismaProductRepository_1 = require("../modules/product/repositories/PrismaProductRepository");
const ProductController_1 = require("../modules/product/controllers/ProductController");
const product_routes_1 = require("../modules/product/routes/product.routes");
const tokens_1 = require("../shared/container/tokens");
// Registrar implementaciones para los tokens (interfaces)
tsyringe_1.container.register(tokens_1.DatabaseRepositoryToken, { useClass: PrismaDatabaseRepository_1.PrismaDatabaseRepository });
tsyringe_1.container.register(tokens_1.OrganizationRepositoryToken, { useClass: PrismaOrganizationRepository_1.PrismaOrganizationRepository });
tsyringe_1.container.register(tokens_1.UserRepositoryToken, { useClass: PrismaUserRepository_1.PrismaUserRepository });
tsyringe_1.container.register(tokens_1.CategoryRepositoryToken, { useClass: PrismaCategoryRepository_1.PrismaCategoryRepository });
tsyringe_1.container.register(tokens_1.CustomerRepositoryToken, { useClass: PrismaCustomerRepository_1.PrismaCustomerRepository });
tsyringe_1.container.register(tokens_1.ProductRepositoryToken, { useClass: PrismaProductRepository_1.PrismaProductRepository });
// Resolver controladores (sus dependencias se inyectan automáticamente)
const healthController = tsyringe_1.container.resolve(HealthController_1.HealthController);
const organizationController = tsyringe_1.container.resolve(OrganizationController_1.OrganizationController);
const userController = tsyringe_1.container.resolve(UserController_1.UserController);
const categoryController = tsyringe_1.container.resolve(CategoryController_1.CategoryController);
const customerController = tsyringe_1.container.resolve(CustomerController_1.CustomerController);
const productController = tsyringe_1.container.resolve(ProductController_1.ProductController);
exports.container = {
    healthRouter: (0, healthRoutes_1.createHealthRouter)(healthController),
    organizationRouter: (0, organization_routes_1.createOrganizationRouter)(organizationController),
    userRouter: (0, user_routes_1.createUserRouter)(userController),
    categoryRouter: (0, category_routes_1.createCategoryRouter)(categoryController),
    customerRouter: (0, customer_routes_1.createCustomerRouter)(customerController),
    productRouter: (0, product_routes_1.createProductRouter)(productController),
    prisma: prisma_1.prisma,
};
