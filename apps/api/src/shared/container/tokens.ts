/**
 * Tokens para inyección de dependencias (interfaces).
 * Las interfaces no existen en runtime en JS, por eso usamos tokens.
 */
export const DatabaseRepositoryToken = Symbol.for('DatabaseRepository');
export const OrganizationRepositoryToken = Symbol.for('IOrganizationRepository');
export const UserRepositoryToken = Symbol.for('IUserRepository');
export const CategoryRepositoryToken = Symbol.for('ICategoryRepository');
export const CustomerRepositoryToken = Symbol.for('ICustomerRepository');
export const ProductRepositoryToken = Symbol.for('IProductRepository');
export const ProductTaxRepositoryToken = Symbol.for('IProductTaxRepository');
export const SupplierRepositoryToken = Symbol.for('ISupplierRepository');
export const InvoiceResolutionRepositoryToken = Symbol.for('IInvoiceResolutionRepository');
export const InvoiceRepositoryToken = Symbol.for('IInvoiceRepository');
export const PaymentRepositoryToken = Symbol.for('IPaymentRepository');
export const CashSessionRepositoryToken = Symbol.for('ICashSessionRepository');
export const ExpenseRepositoryToken = Symbol.for('IExpenseRepository');
export const PurchaseRepositoryToken = Symbol.for('IPurchaseRepository');
export const StockMovementRepositoryToken = Symbol.for('IStockMovementRepository');
