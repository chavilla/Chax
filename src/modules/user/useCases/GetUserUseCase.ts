import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { User } from '../domain/entities/User';
import { AppError } from '../../../shared/errors/AppError';
import { UserRepositoryToken } from '../../../shared/container/tokens';

@injectable()
export class GetUserUseCase implements UseCase<string, User> {
    constructor(
        @inject(UserRepositoryToken) private readonly userRepository: IUserRepository
    ) {}

    async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError('Usuario no encontrado', 404);
        }
        return user;
    }
}
