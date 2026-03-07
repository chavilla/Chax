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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const Product_1 = require("../domain/entities/Product");
const AppError_1 = require("../../../shared/errors/AppError");
const tokens_1 = require("../../../shared/container/tokens");
let UpdateProductUseCase = class UpdateProductUseCase {
    productRepository;
    organizationRepository;
    categoryRepository;
    constructor(productRepository, organizationRepository, categoryRepository) {
        this.productRepository = productRepository;
        this.organizationRepository = organizationRepository;
        this.categoryRepository = categoryRepository;
    }
    async execute(request) {
        const { id, ...updates } = request;
        const existing = await this.productRepository.findById(id);
        if (!existing) {
            throw new AppError_1.AppError('Producto no encontrado', 404);
        }
        const organizationId = updates.organizationId ?? existing.props.organizationId;
        if (updates.organizationId) {
            const organization = await this.organizationRepository.findById(updates.organizationId);
            if (!organization) {
                throw new AppError_1.AppError('Organización no encontrada', 404);
            }
        }
        if (updates.categoryId !== undefined && updates.categoryId !== null) {
            const category = await this.categoryRepository.findById(updates.categoryId);
            if (!category) {
                throw new AppError_1.AppError('Categoría no encontrada', 404);
            }
            if (category.props.organizationId !== organizationId) {
                throw new AppError_1.AppError('La categoría no pertenece a esta organización', 400);
            }
        }
        if (updates.internalCode !== undefined &&
            updates.internalCode !== existing.props.internalCode) {
            const exists = await this.productRepository.existsByInternalCodeAndOrganization(organizationId, updates.internalCode, id);
            if (exists) {
                throw new AppError_1.AppError(`Ya existe un producto con el código interno "${updates.internalCode}" en esta organización`);
            }
        }
        const newName = updates.name !== undefined ? updates.name.trim().toUpperCase() : existing.props.name;
        if (newName !== existing.props.name) {
            const nameExists = await this.productRepository.existsByNameAndOrganization(organizationId, newName, id);
            if (nameExists) {
                throw new AppError_1.AppError(`Ya existe un producto con el nombre "${updates.name?.trim()}" en esta organización`);
            }
        }
        const newBarcode = updates.barcode !== undefined ? updates.barcode : existing.props.barcode;
        if (newBarcode && newBarcode.trim() !== '' && newBarcode !== existing.props.barcode) {
            const barcodeExists = await this.productRepository.existsByBarcodeAndOrganization(organizationId, newBarcode.trim(), id);
            if (barcodeExists) {
                throw new AppError_1.AppError(`Ya existe un producto con el código de barras "${newBarcode}" en esta organización`);
            }
        }
        const mergedProps = {
            internalCode: updates.internalCode ?? existing.props.internalCode,
            barcode: updates.barcode !== undefined ? updates.barcode : existing.props.barcode,
            name: updates.name ?? existing.props.name,
            description: updates.description !== undefined ? updates.description : existing.props.description,
            salePrice: updates.salePrice ?? existing.props.salePrice,
            costPrice: updates.costPrice ?? existing.props.costPrice,
            unitOfMeasure: updates.unitOfMeasure ?? existing.props.unitOfMeasure,
            taxType: updates.taxType ?? existing.props.taxType,
            taxPercentage: updates.taxPercentage ?? existing.props.taxPercentage,
            stock: updates.stock ?? existing.props.stock,
            minStock: updates.minStock ?? existing.props.minStock,
            isActive: updates.isActive ?? existing.props.isActive,
            categoryId: updates.categoryId !== undefined ? updates.categoryId : existing.props.categoryId,
            organizationId,
            createdAt: existing.props.createdAt,
            updatedAt: new Date(),
        };
        const updatedProduct = Product_1.Product.create(mergedProps, id);
        await this.productRepository.save(updatedProduct);
        return updatedProduct;
    }
};
exports.UpdateProductUseCase = UpdateProductUseCase;
exports.UpdateProductUseCase = UpdateProductUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.ProductRepositoryToken)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.OrganizationRepositoryToken)),
    __param(2, (0, tsyringe_1.inject)(tokens_1.CategoryRepositoryToken)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UpdateProductUseCase);
