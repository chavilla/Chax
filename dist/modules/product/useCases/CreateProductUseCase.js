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
exports.CreateProductUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const Product_1 = require("../domain/entities/Product");
const AppError_1 = require("../../../shared/errors/AppError");
const client_1 = require("@prisma/client");
const tokens_1 = require("../../../shared/container/tokens");
let CreateProductUseCase = class CreateProductUseCase {
    productRepository;
    organizationRepository;
    categoryRepository;
    constructor(productRepository, organizationRepository, categoryRepository) {
        this.productRepository = productRepository;
        this.organizationRepository = organizationRepository;
        this.categoryRepository = categoryRepository;
    }
    async execute(request) {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError_1.AppError('Organización no encontrada', 404);
        }
        if (request.categoryId) {
            const category = await this.categoryRepository.findById(request.categoryId);
            if (!category) {
                throw new AppError_1.AppError('Categoría no encontrada', 404);
            }
            if (category.props.organizationId !== request.organizationId) {
                throw new AppError_1.AppError('La categoría no pertenece a esta organización', 400);
            }
        }
        let internalCode = request.internalCode?.trim();
        if (!internalCode) {
            const prefix = (request.internalCodePrefix?.trim() || 'PROD').toUpperCase();
            if (prefix.length === 0) {
                throw new AppError_1.AppError('El prefijo del código interno no puede estar vacío', 400);
            }
            const nextSeq = await this.productRepository.getNextSequenceForPrefix(request.organizationId, prefix);
            internalCode = `${prefix}-${String(nextSeq).padStart(4, '0')}`;
        }
        const internalCodeExists = await this.productRepository.existsByInternalCodeAndOrganization(request.organizationId, internalCode);
        if (internalCodeExists) {
            throw new AppError_1.AppError(`Ya existe un producto con el código interno "${internalCode}" en esta organización`);
        }
        if (request.barcode && request.barcode.trim() !== '') {
            const barcodeExists = await this.productRepository.existsByBarcodeAndOrganization(request.organizationId, request.barcode.trim());
            if (barcodeExists) {
                throw new AppError_1.AppError(`Ya existe un producto con el código de barras "${request.barcode}" en esta organización`);
            }
        }
        const nameNormalized = request.name.trim().toUpperCase();
        const nameExists = await this.productRepository.existsByNameAndOrganization(request.organizationId, nameNormalized);
        if (nameExists) {
            throw new AppError_1.AppError(`Ya existe un producto con el nombre "${request.name.trim()}" en esta organización`);
        }
        const product = Product_1.Product.create({
            internalCode,
            barcode: request.barcode ?? null,
            name: request.name,
            description: request.description ?? null,
            salePrice: request.salePrice,
            costPrice: request.costPrice ?? 0,
            unitOfMeasure: request.unitOfMeasure ?? '94',
            taxType: request.taxType ?? client_1.TaxType.EXCLUIDO,
            taxPercentage: request.taxPercentage ?? 0,
            stock: request.stock ?? 0,
            minStock: request.minStock ?? 0,
            isActive: request.isActive ?? true,
            categoryId: request.categoryId ?? null,
            organizationId: request.organizationId,
        });
        await this.productRepository.save(product);
        return product;
    }
};
exports.CreateProductUseCase = CreateProductUseCase;
exports.CreateProductUseCase = CreateProductUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.ProductRepositoryToken)),
    __param(1, (0, tsyringe_1.inject)(tokens_1.OrganizationRepositoryToken)),
    __param(2, (0, tsyringe_1.inject)(tokens_1.CategoryRepositoryToken)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateProductUseCase);
