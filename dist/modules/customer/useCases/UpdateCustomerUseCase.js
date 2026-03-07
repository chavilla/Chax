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
exports.UpdateCustomerUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const Customer_1 = require("../domain/entities/Customer");
const AppError_1 = require("../../../shared/errors/AppError");
const tokens_1 = require("../../../shared/container/tokens");
let UpdateCustomerUseCase = class UpdateCustomerUseCase {
    customerRepository;
    organizationRepository;
    constructor(customerRepository, organizationRepository) {
        this.customerRepository = customerRepository;
        this.organizationRepository = organizationRepository;
    }
    async execute(request) {
        const { id, ...updates } = request;
        const existing = await this.customerRepository.findById(id);
        if (!existing) {
            throw new AppError_1.AppError('Cliente no encontrado', 404);
        }
        const organizationId = updates.organizationId ?? existing.props.organizationId;
        if (updates.organizationId) {
            const organization = await this.organizationRepository.findById(updates.organizationId);
            if (!organization) {
                throw new AppError_1.AppError('Organización no encontrada', 404);
            }
        }
        if (updates.idNumber !== undefined && updates.idNumber !== existing.props.idNumber) {
            const exists = await this.customerRepository.existsByIdNumberAndOrganization(organizationId, updates.idNumber, id);
            if (exists) {
                throw new AppError_1.AppError(`Ya existe un cliente con el documento ${updates.idNumber} en esta organización`);
            }
        }
        const mergedProps = {
            idType: updates.idType ?? existing.props.idType,
            idNumber: updates.idNumber ?? existing.props.idNumber,
            dv: updates.dv !== undefined ? updates.dv : existing.props.dv,
            name: updates.name ?? existing.props.name,
            email: updates.email !== undefined ? updates.email : existing.props.email,
            phone: updates.phone !== undefined ? updates.phone : existing.props.phone,
            address: updates.address !== undefined ? updates.address : existing.props.address,
            city: updates.city !== undefined ? updates.city : existing.props.city,
            department: updates.department !== undefined ? updates.department : existing.props.department,
            taxRegime: updates.taxRegime ?? existing.props.taxRegime,
            fiscalResponsibilities: updates.fiscalResponsibilities !== undefined
                ? updates.fiscalResponsibilities
                : existing.props.fiscalResponsibilities,
            organizationId,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };
        const updatedCustomer = Customer_1.Customer.create(mergedProps, id);
        await this.customerRepository.save(updatedCustomer);
        return updatedCustomer;
    }
};
exports.UpdateCustomerUseCase = UpdateCustomerUseCase;
exports.UpdateCustomerUseCase = UpdateCustomerUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.CustomerRepositoryToken)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.OrganizationRepositoryToken)),
    __metadata("design:paramtypes", [Object, Object])
], UpdateCustomerUseCase);
