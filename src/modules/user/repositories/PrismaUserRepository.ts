import { injectable } from 'tsyringe';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { User, UserProps } from '../domain/entities/User';
import { prisma } from '../../../infrastructure/database/prisma';
import { User as PrismaUser } from '@prisma/client';

@injectable()
export class PrismaUserRepository implements IUserRepository {
    async existsByEmail(email: string): Promise<boolean> {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return !!user;
    }

    async save(user: User): Promise<void> {
        const data = {
            id: user.id,
            email: user.props.email,
            password: user.props.password,
            name: user.props.name,
            role: user.props.role,
            isActive: user.props.isActive,
            organizationId: user.props.organizationId ?? null,
        };

        await prisma.user.upsert({
            where: { id: user.id },
            update: data,
            create: data,
        });
    }

    async findById(id: string): Promise<User | null> {
        const prismaUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!prismaUser) return null;
        return this.mapToDomain(prismaUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        const prismaUser = await prisma.user.findUnique({
            where: { email },
        });

        if (!prismaUser) return null;
        return this.mapToDomain(prismaUser);
    }

    async findAllByOrganization(organizationId: string): Promise<User[]> {
        const list = await prisma.user.findMany({
            where: { organizationId },
            orderBy: { name: 'asc' },
        });
        return list.map((u) => this.mapToDomain(u));
    }

    async findAll(): Promise<User[]> {
        const list = await prisma.user.findMany({
            orderBy: { name: 'asc' },
        });
        return list.map((u) => this.mapToDomain(u));
    }

    private mapToDomain(prismaUser: PrismaUser): User {
        const props: UserProps = {
            email: prismaUser.email,
            password: prismaUser.password,
            name: prismaUser.name,
            role: prismaUser.role,
            isActive: prismaUser.isActive,
            organizationId: prismaUser.organizationId ?? undefined,
            createdAt: prismaUser.createdAt,
            updatedAt: prismaUser.updatedAt,
        };

        return User.create(props, prismaUser.id);
    }
}
