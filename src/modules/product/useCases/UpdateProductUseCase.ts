import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { ICategoryRepository } from '../../category/domain/repositories/ICategoryRepository';
import { UpdateProductDTO } from '../dtos/product.dtos';
import { Product } from '../domain/entities/Product';
import { AppError } from '../../../shared/errors/AppError';
import {
    ProductRepositoryToken,
    OrganizationRepositoryToken,
    CategoryRepositoryToken,
} from '../../../shared/container/tokens';

@injectable()
export class UpdateProductUseCase implements UseCase<UpdateProductDTO, Product> {
    constructor(
        @inject(ProductRepositoryToken) private readonly productRepository: IProductRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(CategoryRepositoryToken) private readonly categoryRepository: ICategoryRepository
    ) {}

    async execute(request: UpdateProductDTO): Promise<Product> {
        const { id, ...updates } = request;

        const existing = await this.productRepository.findById(id);
        if (!existing) {
            throw new AppError('Producto no encontrado', 404);
        }

        const organizationId = updates.organizationId ?? existing.props.organizationId;

        if (updates.organizationId) {
            const organization = await this.organizationRepository.findById(updates.organizationId);
            if (!organization) {
                throw new AppError('Organización no encontrada', 404);
            }
        }

        if (updates.categoryId !== undefined && updates.categoryId !== null) {
            const category = await this.categoryRepository.findById(updates.categoryId);
            if (!category) {
                throw new AppError('Categoría no encontrada', 404);
            }
            if (category.props.organizationId !== organizationId) {
                throw new AppError('La categoría no pertenece a esta organización', 400);
            }
        }

        if (
            updates.internalCode !== undefined &&
            updates.internalCode !== existing.props.internalCode
        ) {
            const exists = await this.productRepository.existsByInternalCodeAndOrganization(
                organizationId,
                updates.internalCode,
                id
            );
            if (exists) {
                throw new AppError(
                    `Ya existe un producto con el código interno "${updates.internalCode}" en esta organización`
                );
            }
        }

        const newName =
            updates.name !== undefined ? updates.name.trim().toUpperCase() : existing.props.name;
        if (newName !== existing.props.name) {
            const nameExists = await this.productRepository.existsByNameAndOrganization(
                organizationId,
                newName,
                id
            );
            if (nameExists) {
                throw new AppError(
                    `Ya existe un producto con el nombre "${updates.name?.trim()}" en esta organización`
                );
            }
        }

        const newBarcode = updates.barcode !== undefined ? updates.barcode : existing.props.barcode;
        if (newBarcode && newBarcode.trim() !== '' && newBarcode !== existing.props.barcode) {
            const barcodeExists = await this.productRepository.existsByBarcodeAndOrganization(
                organizationId,
                newBarcode.trim(),
                id
            );
            if (barcodeExists) {
                throw new AppError(
                    `Ya existe un producto con el código de barras "${newBarcode}" en esta organización`
                );
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

        const updatedProduct = Product.create(mergedProps, id);
        await this.productRepository.save(updatedProduct);

        return updatedProduct;
    }
}
