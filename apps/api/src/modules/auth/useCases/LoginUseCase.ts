import { injectable, inject } from 'tsyringe';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UseCase } from '../../../shared/core/UseCase';
import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { UserRepositoryToken } from '../../../shared/container/tokens';
import { AppError } from '../../../shared/errors/AppError';
import type { LoginDTO } from '../dtos/auth.dtos';
import type { AuthUser } from '../../../shared/auth/AuthUser';

const JWT_SECRET = process.env.JWT_SECRET ?? 'chax-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export interface LoginResult {
    token: string;
    user: AuthUser & { name: string };
}

@injectable()
export class LoginUseCase implements UseCase<LoginDTO, LoginResult> {
    constructor(
        @inject(UserRepositoryToken) private readonly userRepository: IUserRepository
    ) {}

    async execute(request: LoginDTO): Promise<LoginResult> {
        const user = await this.userRepository.findByEmail(request.email.trim().toLowerCase());
        if (!user) {
            throw new AppError('Credenciales inválidas', 401);
        }
        if (!user.props.isActive) {
            throw new AppError('Usuario inactivo', 403);
        }

        const valid = await bcrypt.compare(request.password, user.props.password);
        if (!valid) {
            throw new AppError('Credenciales inválidas', 401);
        }

        const payload: AuthUser = {
            id: user.id,
            email: user.props.email,
            role: user.props.role,
            organizationId: user.props.organizationId ?? null,
        };
        const token = jwt.sign(
            payload as object,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
        );

        return {
            token,
            user: {
                ...payload,
                name: user.props.name,
            },
        };
    }
}
