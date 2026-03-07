"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCategoryRepository = void 0;
const tsyringe_1 = require("tsyringe");
const Category_1 = require("../domain/entities/Category");
const prisma_1 = require("../../../infrastructure/database/prisma");
let PrismaCategoryRepository = class PrismaCategoryRepository {
    async existsByNameAndOrganization(organizationId, name, excludeId) {
        const existing = await prisma_1.prisma.category.findFirst({
            where: {
                organizationId,
                name,
                ...(excludeId ? { id: { not: excludeId } } : {}),
            },
        });
        return !!existing;
    }
    async save(category) {
        const data = {
            id: category.id,
            name: category.props.name,
            description: category.props.description ?? null,
            organizationId: category.props.organizationId,
        };
        await prisma_1.prisma.category.upsert({
            where: { id: category.id },
            update: data,
            create: data,
        });
    }
    async findById(id) {
        const prismaCategory = await prisma_1.prisma.category.findUnique({
            where: { id },
        });
        if (!prismaCategory)
            return null;
        return this.mapToDomain(prismaCategory);
    }
    async findAllByOrganization(organizationId) {
        const list = await prisma_1.prisma.category.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });
        return list.map((c) => this.mapToDomain(c));
    }
    mapToDomain(prismaCategory) {
        const props = {
            name: prismaCategory.name,
            description: prismaCategory.description ?? undefined,
            organizationId: prismaCategory.organizationId,
            createdAt: prismaCategory.createdAt,
            updatedAt: prismaCategory.updatedAt,
        };
        return Category_1.Category.create(props, prismaCategory.id);
    }
};
exports.PrismaCategoryRepository = PrismaCategoryRepository;
exports.PrismaCategoryRepository = PrismaCategoryRepository = __decorate([
    (0, tsyringe_1.injectable)()
], PrismaCategoryRepository);
