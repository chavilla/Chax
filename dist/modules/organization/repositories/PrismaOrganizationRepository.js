"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaOrganizationRepository = void 0;
const tsyringe_1 = require("tsyringe");
const Organization_1 = require("../domain/entities/Organization");
const prisma_1 = require("../../../infrastructure/database/prisma");
let PrismaOrganizationRepository = class PrismaOrganizationRepository {
    async exists(nit) {
        const organization = await prisma_1.prisma.organization.findUnique({
            where: { nit },
        });
        return !!organization;
    }
    async save(organization) {
        const data = {
            id: organization.id,
            nit: organization.props.nit,
            dv: organization.props.dv,
            businessName: organization.props.businessName,
            tradeName: organization.props.tradeName,
            address: organization.props.address,
            city: organization.props.city,
            department: organization.props.department,
            phone: organization.props.phone,
            email: organization.props.email,
            economicActivityCode: organization.props.economicActivityCode,
            taxRegime: organization.props.taxRegime,
            usesDian: organization.props.usesDian,
            logoUrl: organization.props.logoUrl,
        };
        await prisma_1.prisma.organization.upsert({
            where: { id: organization.id },
            update: data,
            create: data,
        });
    }
    async findById(id) {
        const prismaOrg = await prisma_1.prisma.organization.findUnique({
            where: { id },
        });
        if (!prismaOrg)
            return null;
        return this.mapToDomain(prismaOrg);
    }
    async findByNit(nit) {
        const prismaOrg = await prisma_1.prisma.organization.findUnique({
            where: { nit },
        });
        if (!prismaOrg)
            return null;
        return this.mapToDomain(prismaOrg);
    }
    mapToDomain(prismaOrg) {
        const props = {
            nit: prismaOrg.nit,
            dv: prismaOrg.dv || undefined,
            businessName: prismaOrg.businessName,
            tradeName: prismaOrg.tradeName || undefined,
            address: prismaOrg.address,
            city: prismaOrg.city,
            department: prismaOrg.department,
            phone: prismaOrg.phone || undefined,
            email: prismaOrg.email,
            economicActivityCode: prismaOrg.economicActivityCode || undefined,
            taxRegime: prismaOrg.taxRegime,
            usesDian: prismaOrg.usesDian,
            logoUrl: prismaOrg.logoUrl || undefined,
            createdAt: prismaOrg.createdAt,
            updatedAt: prismaOrg.updatedAt,
        };
        return Organization_1.Organization.create(props, prismaOrg.id);
    }
};
exports.PrismaOrganizationRepository = PrismaOrganizationRepository;
exports.PrismaOrganizationRepository = PrismaOrganizationRepository = __decorate([
    (0, tsyringe_1.injectable)()
], PrismaOrganizationRepository);
