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
exports.CustomerController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateCustomerUseCase_1 = require("../useCases/CreateCustomerUseCase");
const UpdateCustomerUseCase_1 = require("../useCases/UpdateCustomerUseCase");
const GetCustomersUseCase_1 = require("../useCases/GetCustomersUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let CustomerController = class CustomerController {
    createCustomerUseCase;
    updateCustomerUseCase;
    getCustomersUseCase;
    constructor(createCustomerUseCase, updateCustomerUseCase, getCustomersUseCase) {
        this.createCustomerUseCase = createCustomerUseCase;
        this.updateCustomerUseCase = updateCustomerUseCase;
        this.getCustomersUseCase = getCustomersUseCase;
    }
    toResponse(customer) {
        return {
            id: customer.id,
            idType: customer.props.idType,
            idNumber: customer.props.idNumber,
            dv: customer.props.dv ?? null,
            name: customer.props.name,
            email: customer.props.email ?? null,
            phone: customer.props.phone ?? null,
            address: customer.props.address ?? null,
            city: customer.props.city ?? null,
            department: customer.props.department ?? null,
            taxRegime: customer.props.taxRegime,
            fiscalResponsibilities: customer.props.fiscalResponsibilities ?? null,
            organizationId: customer.props.organizationId,
        };
    }
    async getCustomers(request, response) {
        try {
            const organizationId = request.query.organizationId;
            const customers = await this.getCustomersUseCase.execute(organizationId);
            return response.status(200).json(customers.map((c) => this.toResponse(c)));
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
            const { idType, idNumber, dv, name, email, phone, address, city, department, taxRegime, fiscalResponsibilities, organizationId, } = request.body;
            const customer = await this.createCustomerUseCase.execute({
                idType,
                idNumber,
                dv,
                name,
                email,
                phone,
                address,
                city,
                department,
                taxRegime,
                fiscalResponsibilities,
                organizationId,
            });
            return response.status(201).json(this.toResponse(customer));
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
            const customer = await this.updateCustomerUseCase.execute({ id, ...body });
            return response.status(200).json(this.toResponse(customer));
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
};
exports.CustomerController = CustomerController;
exports.CustomerController = CustomerController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [CreateCustomerUseCase_1.CreateCustomerUseCase,
        UpdateCustomerUseCase_1.UpdateCustomerUseCase,
        GetCustomersUseCase_1.GetCustomersUseCase])
], CustomerController);
