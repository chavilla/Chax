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
exports.CreateUserUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../domain/entities/User");
const AppError_1 = require("../../../shared/errors/AppError");
const tokens_1 = require("../../../shared/container/tokens");
let CreateUserUseCase = class CreateUserUseCase {
    userRepository;
    organizationRepository;
    constructor(userRepository, organizationRepository) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
    }
    async execute(request) {
        const emailAlreadyExists = await this.userRepository.existsByEmail(request.email);
        if (emailAlreadyExists) {
            throw new AppError_1.AppError(`Usuario con email ${request.email} ya existe`);
        }
        if (request.organizationId) {
            const organization = await this.organizationRepository.findById(request.organizationId);
            if (!organization) {
                throw new AppError_1.AppError('Organización no encontrada', 404);
            }
        }
        const hashedPassword = await bcryptjs_1.default.hash(request.password, 10);
        const user = User_1.User.create({
            email: request.email,
            password: hashedPassword,
            name: request.name,
            role: request.role ?? 'CASHIER',
            isActive: request.isActive ?? true,
            organizationId: request.organizationId ?? null,
        });
        await this.userRepository.save(user);
        return user;
    }
};
exports.CreateUserUseCase = CreateUserUseCase;
exports.CreateUserUseCase = CreateUserUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.UserRepositoryToken)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.OrganizationRepositoryToken)),
    __metadata("design:paramtypes", [Object, Object])
], CreateUserUseCase);
