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
