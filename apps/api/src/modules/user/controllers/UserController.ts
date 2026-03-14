import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateUserUseCase } from '../useCases/CreateUserUseCase';
import { UpdateUserUseCase } from '../useCases/UpdateUserUseCase';
import { GetUserUseCase } from '../useCases/GetUserUseCase';
import { GetUsersUseCase } from '../useCases/GetUsersUseCase';
import { GetAllUsersUseCase } from '../useCases/GetAllUsersUseCase';
import { AppError } from '../../../shared/errors/AppError';

@injectable()
export class UserController {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly getUsersUseCase: GetUsersUseCase,
        private readonly getAllUsersUseCase: GetAllUsersUseCase
    ) {}

    private toResponse(user: { id: string; props: { email: string; name: string; role: string; isActive: boolean; organizationId?: string | null } }) {
        return {
            id: user.id,
            email: user.props.email,
            name: user.props.name,
            role: user.props.role,
            isActive: user.props.isActive,
            organizationId: user.props.organizationId ?? null,
        };
    }

    async getById(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const user = await this.getUserUseCase.execute(id);
            return response.status(200).json(this.toResponse(user));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async getUsers(request: Request, response: Response): Promise<Response> {
        try {
            const organizationId = request.query.organizationId as string;
            const users = await this.getUsersUseCase.execute(organizationId);
            return response.status(200).json(users.map((u) => this.toResponse(u)));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async getAllUsers(request: Request, response: Response): Promise<Response> {
        try {
            const users = await this.getAllUsersUseCase.execute();
            return response.status(200).json(users.map((u) => this.toResponse(u)));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async create(request: Request, response: Response): Promise<Response> {
        try {
            const { email, password, name, role, isActive, organizationId } = request.body;

            const user = await this.createUserUseCase.execute({
                email,
                password,
                name,
                role,
                isActive,
                organizationId,
            });

            return response.status(201).json(this.toResponse(user));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }

            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

    async update(request: Request, response: Response): Promise<Response> {
        try {
            const id = request.params.id as string;
            const body = request.body as Record<string, unknown>;

            const user = await this.updateUserUseCase.execute({
                id,
                ...body,
            });

            return response.status(200).json(this.toResponse(user));
        } catch (err: unknown) {
            if (err instanceof AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }

            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
}
