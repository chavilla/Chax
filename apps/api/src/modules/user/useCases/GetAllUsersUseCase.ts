import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { User } from '../domain/entities/User';
import { UserRepositoryToken } from '../../../shared/container/tokens';

/** Lista todos los usuarios (uso típico: super admin). La autorización por rol se debe hacer en middleware/auth. */
@injectable()
export class GetAllUsersUseCase implements UseCase<void, User[]> {
    constructor(
        @inject(UserRepositoryToken) private readonly userRepository: IUserRepository
    ) {}

    async execute(): Promise<User[]> {
        return this.userRepository.findAll();
    }
}
