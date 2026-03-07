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
exports.DeleteProductUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const AppError_1 = require("../../../shared/errors/AppError");
const tokens_1 = require("../../../shared/container/tokens");
let DeleteProductUseCase = class DeleteProductUseCase {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(request) {
        const { id, organizationId } = request;
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new AppError_1.AppError('Producto no encontrado', 404);
        }
        if (product.props.organizationId !== organizationId) {
            throw new AppError_1.AppError('Producto no encontrado', 404);
        }
        const { invoiceItems, stockMovements } = await this.productRepository.countDependencies(id);
        if (invoiceItems > 0) {
            throw new AppError_1.AppError('No se puede eliminar el producto porque tiene líneas en facturas asociadas', 400);
        }
        if (stockMovements > 0) {
            throw new AppError_1.AppError('No se puede eliminar el producto porque tiene movimientos de inventario asociados', 400);
        }
        await this.productRepository.delete(id);
    }
};
exports.DeleteProductUseCase = DeleteProductUseCase;
exports.DeleteProductUseCase = DeleteProductUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(tokens_1.ProductRepositoryToken)),
    __metadata("design:paramtypes", [Object])
], DeleteProductUseCase);
