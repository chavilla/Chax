"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryToken = exports.OrganizationRepositoryToken = exports.DatabaseRepositoryToken = void 0;
/**
 * Tokens para inyección de dependencias (interfaces).
 * Las interfaces no existen en runtime en JS, por eso usamos tokens.
 */
exports.DatabaseRepositoryToken = Symbol.for('DatabaseRepository');
exports.OrganizationRepositoryToken = Symbol.for('IOrganizationRepository');
exports.UserRepositoryToken = Symbol.for('IUserRepository');
