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
exports.CategoryController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateCategoryUseCase_1 = require("../useCases/CreateCategoryUseCase");
const UpdateCategoryUseCase_1 = require("../useCases/UpdateCategoryUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let CategoryController = class CategoryController {
    createCategoryUseCase;
    updateCategoryUseCase;
    constructor(createCategoryUseCase, updateCategoryUseCase) {
        this.createCategoryUseCase = createCategoryUseCase;
        this.updateCategoryUseCase = updateCategoryUseCase;
    }
    async create(request, response) {
        try {
            const { name, description, organizationId } = request.body;
            const category = await this.createCategoryUseCase.execute({
                name,
                description,
                organizationId,
            });
            return response.status(201).json({
                id: category.id,
                name: category.props.name,
                description: category.props.description ?? null,
                organizationId: category.props.organizationId,
            });
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
            const category = await this.updateCategoryUseCase.execute({
                id,
                ...body,
            });
            return response.status(200).json({
                id: category.id,
                name: category.props.name,
                description: category.props.description ?? null,
                organizationId: category.props.organizationId,
            });
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
};
exports.CategoryController = CategoryController;
exports.CategoryController = CategoryController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [CreateCategoryUseCase_1.CreateCategoryUseCase,
        UpdateCategoryUseCase_1.UpdateCategoryUseCase])
], CategoryController);
