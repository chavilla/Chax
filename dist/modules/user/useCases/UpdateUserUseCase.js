"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../domain/entities/User");
const AppError_1 = require("../../../shared/errors/AppError");
const tokens_1 = require("../../../shared/container/tokens");
let UpdateUserUseCase = class UpdateUserUseCase {
    userRepository;
    organizationRepository;
    constructor(userRepository, organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }
    async execute(request) {
        const { id, ...updates } = request;
        const existing = await this.userRepository.findById(id);
        if (!existing) {
            throw new AppError_1.AppError('Usuario no encontrado', 404);
        }
        if (updates.email !== undefined && updates.email !== existing.props.email) {
            const emailExists = await this.userRepository.existsByEmail(updates.email);
            if (emailExists) {
                throw new AppError_1.AppError(`Usuario con email ${updates.email} ya existe`);
            }
        }
        if (updates.organizationId !== undefined && updates.organizationId !== null) {
            const organization = await this.organizationRepository.findById(updates.organizationId);
            if (!organization) {
                throw new AppError_1.AppError('Organización no encontrada', 404);
            }
        }
        const passwordHash = updates.password !== undefined && updates.password !== ''
            ? await bcryptjs_1.default.hash(updates.password, 10)
            : existing.props.password;
        const mergedProps = {
            email: updates.email ?? existing.props.email,
            password: passwordHash,
            name: updates.name ?? existing.props.name,
            role: updates.role ?? existing.props.role,
            isActive: updates.isActive ?? existing.props.isActive,
            organizationId: updates.organizationId !== undefined ? updates.organizationId : existing.props.organizationId,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };
        const updatedUser = User_1.User.create(mergedProps, id);
        await this.userRepository.save(updatedUser);
        return updatedUser;
    }
};
exports.UpdateUserUseCase = UpdateUserUseCase;
exports.UpdateUserUseCase = UpdateUserUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.UserRepositoryToken)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.OrganizationRepositoryToken)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateUserUseCase);
