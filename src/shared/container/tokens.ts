/**
 * Tokens para inyección de dependencias (interfaces).
 * Las interfaces no existen en runtime en JS, por eso usamos tokens.
 */
export const DatabaseRepositoryToken = Symbol.for('DatabaseRepository');
export const OrganizationRepositoryToken = Symbol.for('IOrganizationRepository');
