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
import { PrismaProductTaxRepository } from '../modules/productTax/repositories/PrismaProductTaxRepository';
import { ProductTaxController } from '../modules/productTax/controllers/ProductTaxController';
import { createProductTaxRouter } from '../modules/productTax/routes/productTax.routes';
import { PrismaSupplierRepository } from '../modules/supplier/repositories/PrismaSupplierRepository';
import { SupplierController } from '../modules/supplier/controllers/SupplierController';
import { createSupplierRouter } from '../modules/supplier/routes/supplier.routes';
import { PrismaInvoiceResolutionRepository } from '../modules/invoiceResolution/repositories/PrismaInvoiceResolutionRepository';
import { InvoiceResolutionController } from '../modules/invoiceResolution/controllers/InvoiceResolutionController';
import { createInvoiceResolutionRouter } from '../modules/invoiceResolution/routes/invoiceResolution.routes';
import { PrismaInvoiceRepository } from '../modules/invoice/repositories/PrismaInvoiceRepository';
import { InvoiceController } from '../modules/invoice/controllers/InvoiceController';
import { createInvoiceRouter } from '../modules/invoice/routes/invoice.routes';
import { PrismaPaymentRepository } from '../modules/payment/repositories/PrismaPaymentRepository';
import { PrismaCashSessionRepository } from '../modules/cashSession/repositories/PrismaCashSessionRepository';
import { CashSessionController } from '../modules/cashSession/controllers/CashSessionController';
import { createCashSessionRouter } from '../modules/cashSession/routes/cashSession.routes';
import { PrismaExpenseRepository } from '../modules/expense/repositories/PrismaExpenseRepository';
import { ExpenseController } from '../modules/expense/controllers/ExpenseController';
import { createExpenseRouter } from '../modules/expense/routes/expense.routes';
import { PrismaPurchaseRepository } from '../modules/purchase/repositories/PrismaPurchaseRepository';
import { PurchaseController } from '../modules/purchase/controllers/PurchaseController';
import { createPurchaseRouter } from '../modules/purchase/routes/purchase.routes';
import { PrismaStockMovementRepository } from '../modules/stockMovement/repositories/PrismaStockMovementRepository';
import { StockMovementController } from '../modules/stockMovement/controllers/StockMovementController';
import { createStockMovementRouter } from '../modules/stockMovement/routes/stockMovement.routes';
import {
    DatabaseRepositoryToken,
    OrganizationRepositoryToken,
    UserRepositoryToken,
    CategoryRepositoryToken,
    CustomerRepositoryToken,
    ProductRepositoryToken,
    ProductTaxRepositoryToken,
    SupplierRepositoryToken,
    InvoiceResolutionRepositoryToken,
    InvoiceRepositoryToken,
    PaymentRepositoryToken,
    CashSessionRepositoryToken,
    ExpenseRepositoryToken,
    PurchaseRepositoryToken,
    StockMovementRepositoryToken,
} from '../shared/container/tokens';

// Registrar implementaciones para los tokens (interfaces)
tsyringeContainer.register(DatabaseRepositoryToken, { useClass: PrismaDatabaseRepository });
tsyringeContainer.register(OrganizationRepositoryToken, { useClass: PrismaOrganizationRepository });
tsyringeContainer.register(UserRepositoryToken, { useClass: PrismaUserRepository });
tsyringeContainer.register(CategoryRepositoryToken, { useClass: PrismaCategoryRepository });
tsyringeContainer.register(CustomerRepositoryToken, { useClass: PrismaCustomerRepository });
tsyringeContainer.register(ProductRepositoryToken, { useClass: PrismaProductRepository });
tsyringeContainer.register(ProductTaxRepositoryToken, { useClass: PrismaProductTaxRepository });
tsyringeContainer.register(SupplierRepositoryToken, { useClass: PrismaSupplierRepository });
tsyringeContainer.register(InvoiceResolutionRepositoryToken, { useClass: PrismaInvoiceResolutionRepository });
tsyringeContainer.register(InvoiceRepositoryToken, { useClass: PrismaInvoiceRepository });
tsyringeContainer.register(PaymentRepositoryToken, { useClass: PrismaPaymentRepository });
tsyringeContainer.register(CashSessionRepositoryToken, { useClass: PrismaCashSessionRepository });
tsyringeContainer.register(ExpenseRepositoryToken, { useClass: PrismaExpenseRepository });
tsyringeContainer.register(PurchaseRepositoryToken, { useClass: PrismaPurchaseRepository });
tsyringeContainer.register(StockMovementRepositoryToken, { useClass: PrismaStockMovementRepository });

// Resolver controladores (sus dependencias se inyectan automáticamente)
const healthController = tsyringeContainer.resolve(HealthController);
const organizationController = tsyringeContainer.resolve(OrganizationController);
const userController = tsyringeContainer.resolve(UserController);
const categoryController = tsyringeContainer.resolve(CategoryController);
const customerController = tsyringeContainer.resolve(CustomerController);
const productController = tsyringeContainer.resolve(ProductController);
const productTaxController = tsyringeContainer.resolve(ProductTaxController);
const supplierController = tsyringeContainer.resolve(SupplierController);
const invoiceResolutionController = tsyringeContainer.resolve(InvoiceResolutionController);
const invoiceController = tsyringeContainer.resolve(InvoiceController);
const cashSessionController = tsyringeContainer.resolve(CashSessionController);
const expenseController = tsyringeContainer.resolve(ExpenseController);
const purchaseController = tsyringeContainer.resolve(PurchaseController);
const stockMovementController = tsyringeContainer.resolve(StockMovementController);

export const container = {
    healthRouter: createHealthRouter(healthController),
    organizationRouter: createOrganizationRouter(organizationController),
    userRouter: createUserRouter(userController),
    categoryRouter: createCategoryRouter(categoryController),
    customerRouter: createCustomerRouter(customerController),
    productRouter: createProductRouter(productController),
    productTaxRouter: createProductTaxRouter(productTaxController),
    supplierRouter: createSupplierRouter(supplierController),
    invoiceResolutionRouter: createInvoiceResolutionRouter(invoiceResolutionController),
    invoiceRouter: createInvoiceRouter(invoiceController),
    cashSessionRouter: createCashSessionRouter(cashSessionController),
    expenseRouter: createExpenseRouter(expenseController),
    purchaseRouter: createPurchaseRouter(purchaseController),
    stockMovementRouter: createStockMovementRouter(stockMovementController),
    prisma,
};
