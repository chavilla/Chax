"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const tsyringe_1 = require("tsyringe");
const User_1 = require("../domain/entities/User");
const prisma_1 = require("../../../infrastructure/database/prisma");
let PrismaUserRepository = class PrismaUserRepository {
    async existsByEmail(email) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        return !!user;
    }
    async save(user) {
        const data = {
            id: user.id,
            email: user.props.email,
            password: user.props.password,
            name: user.props.name,
            role: user.props.role,
            isActive: user.props.isActive,
            organizationId: user.props.organizationId ?? null,
        };
        await prisma_1.prisma.user.upsert({
            where: { id: user.id },
            update: data,
            create: data,
        });
    }
    async findById(id) {
        const prismaUser = await prisma_1.prisma.user.findUnique({
            where: { id },
        });
        if (!prismaUser)
            return null;
        return this.mapToDomain(prismaUser);
    }
    async findByEmail(email) {
        const prismaUser = await prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!prismaUser)
            return null;
        return this.mapToDomain(prismaUser);
    }
    mapToDomain(prismaUser) {
        const props = {
            email: prismaUser.email,
            password: prismaUser.password,
            name: prismaUser.name,
            role: prismaUser.role,
            isActive: prismaUser.isActive,
            organizationId: prismaUser.organizationId ?? undefined,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        };
        return User_1.User.create(props, prismaUser.id);
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, tsyringe_1.injectable)()
], PrismaUserRepository);
