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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCategoriesUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const AppError_1 = require("../../../shared/errors/AppError");
const tokens_1 = require("../../../shared/container/tokens");
let GetCategoriesUseCase = class GetCategoriesUseCase {
    categoryRepository;
    organizationRepository;
    constructor(categoryRepository, organizationRepository) {
        this.categoryRepository = categoryRepository;
        this.organizationRepository = organizationRepository;
    }
    async execute(organizationId) {
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new AppError_1.AppError('Organización no encontrada', 404);
        }
        return this.categoryRepository.findAllByOrganization(organizationId);
    }
};
exports.GetCategoriesUseCase = GetCategoriesUseCase;
exports.GetCategoriesUseCase = GetCategoriesUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.CategoryRepositoryToken)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.OrganizationRepositoryToken)),
    __metadata("design:paramtypes", [Object, Object])
], GetCategoriesUseCase);
