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
exports.UpdateOrganizationUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const Organization_1 = require("../domain/entities/Organization");
const AppError_1 = require("../../../shared/errors/AppError");
const tokens_1 = require("../../../shared/container/tokens");
let UpdateOrganizationUseCase = class UpdateOrganizationUseCase {
    organizationRepository;
    constructor(organizationRepository) {
        this.organizationRepository = organizationRepository;
    }
    async execute(request) {
        const { id, ...updates } = request;
        const existing = await this.organizationRepository.findById(id);
        if (!existing) {
            throw new AppError_1.AppError('Organization not found', 404);
        }
        const mergedProps = {
            nit: updates.nit ?? existing.props.nit,
            dv: updates.dv ?? existing.props.dv,
            businessName: updates.businessName ?? existing.props.businessName,
            tradeName: updates.tradeName ?? existing.props.tradeName,
            address: updates.address ?? existing.props.address,
            city: updates.city ?? existing.props.city,
            department: updates.department ?? existing.props.department,
            phone: updates.phone ?? existing.props.phone,
            email: updates.email ?? existing.props.email,
            economicActivityCode: updates.economicActivityCode ?? existing.props.economicActivityCode,
            taxRegime: updates.taxRegime ?? existing.props.taxRegime,
            usesDian: updates.usesDian ?? existing.props.usesDian,
            logoUrl: updates.logoUrl ?? existing.props.logoUrl,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };
        const updatedOrganization = Organization_1.Organization.create(mergedProps, id);
        await this.organizationRepository.save(updatedOrganization);
        return updatedOrganization;
    }
};
exports.UpdateOrganizationUseCase = UpdateOrganizationUseCase;
exports.UpdateOrganizationUseCase = UpdateOrganizationUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.OrganizationRepositoryToken)),
    __metadata("design:paramtypes", [Object])
], UpdateOrganizationUseCase);
