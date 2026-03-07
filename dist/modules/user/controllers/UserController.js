"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateUserUseCase_1 = require("../useCases/CreateUserUseCase");
const UpdateUserUseCase_1 = require("../useCases/UpdateUserUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let UserController = class UserController {
    createUserUseCase;
    updateUserUseCase;
    constructor(createUserUseCase, updateUserUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
    }
    toResponse(user) {
        return {
            id: user.id,
            email: user.props.email,
            name: user.props.name,
            role: user.props.role,
            isActive: user.props.isActive,
            organizationId: user.props.organizationId ?? null,
        };
    }
    async create(request, response) {
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
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
    async update(request, response) {
        try {
            const id = request.params.id;
            const body = request.body;
            const user = await this.updateUserUseCase.execute({
                id,
                ...body,
            });
            return response.status(200).json(this.toResponse(user));
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [CreateUserUseCase_1.CreateUserUseCase,
        UpdateUserUseCase_1.UpdateUserUseCase])
], UserController);
