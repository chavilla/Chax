import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';
import { UseCase } from '../../../shared/core/UseCase';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { UpdateUserDTO } from '../dtos/user.dtos';
import { User } from '../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { UserRepositoryToken, OrganizationRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class UpdateUserUseCase implements UseCase<UpdateUserDTO, User> {
    constructor(
        @inject(UserRepositoryToken) private readonly userRepository: IUserRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository
    ) {}

    async execute(request: UpdateUserDTO): Promise<User> {
        const { id, ...updates } = request;

        const existing = await this.userRepository.findById(id);
        if (!existing) {
            throw new AppError('Usuario no encontrado', 404);
        }

        if (updates.email !== undefined && updates.email !== existing.props.email) {
            const emailExists = await this.userRepository.existsByEmail(updates.email);
            if (emailExists) {
                throw new AppError(`Usuario con email ${updates.email} ya existe`);
            }
        }

        if (updates.organizationId !== undefined && updates.organizationId !== null) {
            const organization = await this.organizationRepository.findById(updates.organizationId);
            if (!organization) {
                throw new AppError('Organización no encontrada', 404);
            }
        }

        const passwordHash =
            updates.password !== undefined && updates.password !== ''
                ? await bcrypt.hash(updates.password, 10)
                : existing.props.password;

        const mergedProps = {
            email: updates.email ?? existing.props.email,
            password: passwordHash,
            name: updates.name ?? existing.props.name,
            role: updates.role ?? existing.props.role,
            isActive: updates.isActive ?? existing.props.isActive,
            organizationId: updates.organizationId !== undefined ? updates.organizationId : existing.props.organizationId,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };

        const updatedUser = User.create(mergedProps, id);
        await this.userRepository.save(updatedUser);

        return updatedUser;
    }
}
