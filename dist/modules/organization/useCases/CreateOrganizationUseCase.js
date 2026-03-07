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
exports.CreateOrganizationUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const Organization_1 = require("../domain/entities/Organization");
const AppError_1 = require("../../../shared/errors/AppError");
const client_1 = require("@prisma/client");
const tokens_1 = require("../../../shared/container/tokens");
let CreateOrganizationUseCase = class CreateOrganizationUseCase {
    organizationRepository;
    constructor(organizationRepository) {
        this.organizationRepository = organizationRepository;
    }
    async execute(request) {
        const { nit } = request;
        // 1. Validate if the organization already exists
        const organizationAlreadyExists = await this.organizationRepository.exists(nit);
        if (organizationAlreadyExists) {
            throw new AppError_1.AppError(`Organización con NIT ${nit} ya existe`);
        }
        // 2. Create the domain entity
        const organizationOrError = Organization_1.Organization.create({
            ...request,
            taxRegime: request.taxRegime || client_1.TaxRegime.NO_RESPONSABLE_IVA,
            usesDian: request.usesDian || false,
        });
        // 3. Persist the entity
        await this.organizationRepository.save(organizationOrError);
        return organizationOrError;
    }
};
exports.CreateOrganizationUseCase = CreateOrganizationUseCase;
exports.CreateOrganizationUseCase = CreateOrganizationUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.OrganizationRepositoryToken)),
    __metadata("design:paramtypes", [Object])
], CreateOrganizationUseCase);
