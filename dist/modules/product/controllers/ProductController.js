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
exports.ProductController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateProductUseCase_1 = require("../useCases/CreateProductUseCase");
const UpdateProductUseCase_1 = require("../useCases/UpdateProductUseCase");
const GetProductsUseCase_1 = require("../useCases/GetProductsUseCase");
const DeleteProductUseCase_1 = require("../useCases/DeleteProductUseCase");
const AppError_1 = require("../../../shared/errors/AppError");
let ProductController = class ProductController {
    createProductUseCase;
    updateProductUseCase;
    getProductsUseCase;
    deleteProductUseCase;
    constructor(createProductUseCase, updateProductUseCase, getProductsUseCase, deleteProductUseCase) {
        this.createProductUseCase = createProductUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.getProductsUseCase = getProductsUseCase;
        this.deleteProductUseCase = deleteProductUseCase;
    }
    toResponse(product) {
        return {
            id: product.id,
            internalCode: product.props.internalCode,
            barcode: product.props.barcode ?? null,
            name: product.props.name,
            description: product.props.description ?? null,
            salePrice: product.props.salePrice,
            costPrice: product.props.costPrice,
            unitOfMeasure: product.props.unitOfMeasure,
            taxType: product.props.taxType,
            taxPercentage: product.props.taxPercentage,
            stock: product.props.stock,
            minStock: product.props.minStock,
            isActive: product.props.isActive,
            categoryId: product.props.categoryId ?? null,
            organizationId: product.props.organizationId,
        };
    }
    async getProducts(request, response) {
        try {
            const organizationId = request.query.organizationId;
            const products = await this.getProductsUseCase.execute(organizationId);
            return response.status(200).json(products.map((p) => this.toResponse(p)));
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
    async create(request, response) {
        try {
            const { internalCode, internalCodePrefix, barcode, name, description, salePrice, costPrice, unitOfMeasure, taxType, taxPercentage, stock, minStock, isActive, categoryId, organizationId, } = request.body;
            const product = await this.createProductUseCase.execute({
                internalCode,
                internalCodePrefix,
                barcode,
                name,
                description,
                salePrice,
                costPrice,
                unitOfMeasure,
                taxType,
                taxPercentage,
                stock,
                minStock,
                isActive,
                categoryId,
                organizationId,
            });
            return response.status(201).json(this.toResponse(product));
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
            const product = await this.updateProductUseCase.execute({ id, ...body });
            return response.status(200).json(this.toResponse(product));
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
    async delete(request, response) {
        try {
            const id = request.params.id;
            const organizationId = request.query.organizationId;
            await this.deleteProductUseCase.execute({ id, organizationId });
            return response.status(204).send();
        }
        catch (err) {
            if (err instanceof AppError_1.AppError) {
                return response.status(err.statusCode).json({ error: err.message });
            }
            return response.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }
};
exports.ProductController = ProductController;
exports.ProductController = ProductController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [CreateProductUseCase_1.CreateProductUseCase,
        UpdateProductUseCase_1.UpdateProductUseCase,
        GetProductsUseCase_1.GetProductsUseCase,
        DeleteProductUseCase_1.DeleteProductUseCase])
], ProductController);
