import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { LoginUseCase } from '../useCases/LoginUseCase';
import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { UserRepositoryToken } from '../../../shared/container/tokens';
import { inject } from 'tsyringe';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        @inject(UserRepositoryToken) private readonly userRepository: IUserRepository
    ) {}

    async login(request: Request, response: Response): Promise<Response> {
        const result = await this.loginUseCase.execute(request.body);
        return response.status(200).json(result);
    }

    /**
     * Devuelve el usuario actual a partir del token (req.user ya seteado por el middleware).
     */
    async me(request: Request, response: Response): Promise<Response> {
        const user = request.user;
        if (!user) {
            throw new AppError('No autenticado', 401);
        }
        const full = await this.userRepository.findById(user.id);
        if (!full) {
            throw new AppError('Usuario no encontrado', 404);
        }
        return response.status(200).json({
            id: full.id,
            email: full.props.email,
            name: full.props.name,
            role: full.props.role,
            organizationId: full.props.organizationId ?? null,
        });
    }
}
