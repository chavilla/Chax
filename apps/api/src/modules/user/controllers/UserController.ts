import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { CreateUserUseCase } from '../useCases/CreateUserUseCase';
import { UpdateUserUseCase } from '../useCases/UpdateUserUseCase';
import { GetUserUseCase } from '../useCases/GetUserUseCase';
import { GetUsersUseCase } from '../useCases/GetUsersUseCase';
import { GetAllUsersUseCase } from '../useCases/GetAllUsersUseCase';
import { getOrganizationIdFromRequest, getUserId, getAuthContext } from '../../../shared/auth/getAuthContext';

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
        const id = request.params.id as string;
        const user = await this.getUserUseCase.execute(id);
        return response.status(200).json(this.toResponse(user));
    }

    async getUsers(request: Request, response: Response): Promise<Response> {
        const organizationId = getOrganizationIdFromRequest(request, response, 'query');
        if (!organizationId) return response;
        const users = await this.getUsersUseCase.execute(organizationId);
        return response.status(200).json(users.map((u) => this.toResponse(u)));
    }

    async getAllUsers(request: Request, response: Response): Promise<Response> {
        const users = await this.getAllUsersUseCase.execute();
        return response.status(200).json(users.map((u) => this.toResponse(u)));
    }

    async create(request: Request, response: Response): Promise<Response> {
        const performedByUserId = getUserId(request) ?? undefined;
        const organizationId = request.user?.organizationId ?? request.body?.organizationId;
        const user = await this.createUserUseCase.execute({
            ...request.body,
            organizationId: organizationId ?? undefined,
            performedByUserId,
        });
        return response.status(201).json(this.toResponse(user));
    }

    async update(request: Request, response: Response): Promise<Response> {
        const ctx = getAuthContext(request, response, 'body');
        if (!ctx) return response;
        const id = request.params.id as string;
        const user = await this.updateUserUseCase.execute({
            id,
            ...request.body,
            performedByUserId: ctx.userId,
        });
        return response.status(200).json(this.toResponse(user));
    }
}
