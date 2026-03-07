"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCustomerRepository = void 0;
const tsyringe_1 = require("tsyringe");
const Customer_1 = require("../domain/entities/Customer");
const prisma_1 = require("../../../infrastructure/database/prisma");
let PrismaCustomerRepository = class PrismaCustomerRepository {
    async existsByIdNumberAndOrganization(organizationId, idNumber, excludeId) {
        const existing = await prisma_1.prisma.customer.findFirst({
            where: {
                organizationId,
                idNumber,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }
    async save(customer) {
        const data = {
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
        await prisma_1.prisma.customer.upsert({
            where: { id: customer.id },
            update: data,
            create: data,
        });
    }
    async findById(id) {
        const prismaCustomer = await prisma_1.prisma.customer.findUnique({
            where: { id },
        });
        if (!prismaCustomer)
            return null;
        return this.mapToDomain(prismaCustomer);
    }
    async findAllByOrganization(organizationId) {
        const list = await prisma_1.prisma.customer.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });
        return list.map((c) => this.mapToDomain(c));
    }
    async findAll() {
        const list = await prisma_1.prisma.customer.findMany({
            orderBy: { name: 'asc' },
        });
        return list.map((c) => this.mapToDomain(c));
    }
    mapToDomain(prismaCustomer) {
        const props = {
            idType: prismaCustomer.idType,
            idNumber: prismaCustomer.idNumber,
            dv: prismaCustomer.dv ?? undefined,
            name: prismaCustomer.name,
            email: prismaCustomer.email ?? undefined,
            phone: prismaCustomer.phone ?? undefined,
            address: prismaCustomer.address ?? undefined,
            city: prismaCustomer.city ?? undefined,
            department: prismaCustomer.department ?? undefined,
            taxRegime: prismaCustomer.taxRegime,
            fiscalResponsibilities: prismaCustomer.fiscalResponsibilities ?? undefined,
            organizationId: prismaCustomer.organizationId,
            createdAt: prismaCustomer.createdAt,
            updatedAt: prismaCustomer.updatedAt,
        };
        return Customer_1.Customer.create(props, prismaCustomer.id);
    }
};
exports.PrismaCustomerRepository = PrismaCustomerRepository;
exports.PrismaCustomerRepository = PrismaCustomerRepository = __decorate([
    (0, tsyringe_1.injectable)()
], PrismaCustomerRepository);
