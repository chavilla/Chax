import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';
import { UseCase } from '../../../shared/core/UseCase';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { CreateUserDTO } from '../dtos/user.dtos';
import { User } from '../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { UserRole } from '@chax/shared';
import { OrganizationRepositoryToken, UserRepositoryToken } from '../../../shared/container/tokens';
import { AuditRecorder } from '../../../shared/audit/AuditRecorder';

@injectable()
export class CreateUserUseCase implements UseCase<CreateUserDTO, User> {
    constructor(
        @inject(UserRepositoryToken) private readonly userRepository: IUserRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(AuditRecorder) private readonly auditRecorder: AuditRecorder
    ) {}

    public async execute(request: CreateUserDTO): Promise<User> {
        const emailAlreadyExists = await this.userRepository.existsByEmail(request.email);
        if (emailAlreadyExists) {
            throw new AppError(`Usuario con email ${request.email} ya existe`);
        }

        if (request.organizationId) {
            const organization = await this.organizationRepository.findById(request.organizationId);
            if (!organization) {
                throw new AppError('Organización no encontrada', 404);
            }
        }

        const hashedPassword = await bcrypt.hash(request.password, 10);

        const user = User.create({
            email: request.email,
            password: hashedPassword,
            name: request.name,
            role: (request.role as UserRole) ?? 'CASHIER',
            isActive: request.isActive ?? true,
            organizationId: request.organizationId ?? null,
        });

        await this.userRepository.save(user);
        const orgId = user.props.organizationId ?? undefined;
        if (orgId) {
            await this.auditRecorder.recordIfUser(request.performedByUserId, {
                action: 'CREATE',
                entity: 'User',
                entityId: user.id,
                newValues: { email: user.props.email, name: user.props.name, role: user.props.role, organizationId: orgId },
                organizationId: orgId,
            });
        }
        return user;
    }
}
