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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateOrganizationUseCase_1 = require("../useCases/CreateOrganizationUseCase");
const UpdateOrganizationUseCase_1 = require("../useCases/UpdateOrganizationUseCase");
const GetOrganizationsUseCase_1 = require("../useCases/GetOrganizationsUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let OrganizationController = class OrganizationController {
    createOrganizationUseCase;
    updateOrganizationUseCase;
    getOrganizationsUseCase;
    constructor(createOrganizationUseCase, updateOrganizationUseCase, getOrganizationsUseCase) {
        this.createOrganizationUseCase = createOrganizationUseCase;
        this.updateOrganizationUseCase = updateOrganizationUseCase;
        this.getOrganizationsUseCase = getOrganizationsUseCase;
    }
    async getOrganizations(_request, response) {
        try {
            const organizations = await this.getOrganizationsUseCase.execute();
            return response.status(200).json(organizations.map((org) => ({
                id: org.id,
                nit: org.props.nit,
                businessName: org.props.businessName,
                tradeName: org.props.tradeName ?? null,
                city: org.props.city,
                email: org.props.email,
            })));
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
    async create(request, response) {
        try {
            const { nit, dv, businessName, tradeName, address, city, department, phone, email, economicActivityCode, taxRegime, usesDian, logoUrl, } = request.body;
            // Notice how the controller only delegates to the use case.
            // DTO validations (like Zod/Yup) would normally happen just before this block.
            const organization = await this.createOrganizationUseCase.execute({
                nit,
                dv,
                businessName,
                tradeName,
                address,
                city,
                department,
                phone,
                email,
                economicActivityCode,
                taxRegime,
                usesDian,
                logoUrl,
            });
            return response.status(201).json({
                id: organization.id,
                nit: organization.props.nit,
                businessName: organization.props.businessName,
            });
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
    async update(request, response) {
        try {
            const id = request.params.id;
            const body = request.body;
            const organization = await this.updateOrganizationUseCase.execute({
                id,
                ...body,
            });
            return response.status(200).json({
                id: organization.id,
                nit: organization.props.nit,
                businessName: organization.props.businessName,
            });
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
};
exports.OrganizationController = OrganizationController;
exports.OrganizationController = OrganizationController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [CreateOrganizationUseCase_1.CreateOrganizationUseCase,
        UpdateOrganizationUseCase_1.UpdateOrganizationUseCase,
        GetOrganizationsUseCase_1.GetOrganizationsUseCase])
], OrganizationController);
