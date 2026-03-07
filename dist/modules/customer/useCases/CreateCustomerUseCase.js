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
exports.CreateCustomerUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const Customer_1 = require("../domain/entities/Customer");
const AppError_1 = require("../../../shared/errors/AppError");
const client_1 = require("@prisma/client");
const tokens_1 = require("../../../shared/container/tokens");
let CreateCustomerUseCase = class CreateCustomerUseCase {
    customerRepository;
    organizationRepository;
    constructor(customerRepository, organizationRepository) {
        this.customerRepository = customerRepository;
        this.organizationRepository = organizationRepository;
    }
    async execute(request) {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError_1.AppError('Organización no encontrada', 404);
        }
        const exists = await this.customerRepository.existsByIdNumberAndOrganization(request.organizationId, request.idNumber);
        if (exists) {
            throw new AppError_1.AppError(`Ya existe un cliente con el documento ${request.idNumber} en esta organización`);
        }
        const customer = Customer_1.Customer.create({
            idType: request.idType ?? client_1.IdType.CC,
            idNumber: request.idNumber,
            dv: request.dv ?? null,
            name: request.name,
            email: request.email ?? null,
            phone: request.phone ?? null,
            address: request.address ?? null,
            city: request.city ?? null,
            department: request.department ?? null,
            taxRegime: request.taxRegime ?? client_1.TaxRegime.NO_RESPONSABLE_IVA,
            fiscalResponsibilities: request.fiscalResponsibilities ?? null,
            organizationId: request.organizationId,
        });
        await this.customerRepository.save(customer);
        return customer;
    }
};
exports.CreateCustomerUseCase = CreateCustomerUseCase;
exports.CreateCustomerUseCase = CreateCustomerUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.CustomerRepositoryToken)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.OrganizationRepositoryToken)),
    __metadata("design:paramtypes", [Object, Object])
], CreateCustomerUseCase);
