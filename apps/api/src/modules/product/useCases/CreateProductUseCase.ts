import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { ICategoryRepository } from '../../category/domain/repositories/ICategoryRepository';
import { CreateProductDTO } from '../dtos/product.dtos';
import { Product } from '../domain/entities/Product';
import { AppError } from '../../../shared/errors/AppError';
import { TaxType } from '@chax/shared';
import {
    ProductRepositoryToken,
    OrganizationRepositoryToken,
    CategoryRepositoryToken,
} from '../../../shared/container/tokens';
import { AuditRecorder } from '../../../shared/audit/AuditRecorder';

@injectable()
export class CreateProductUseCase implements UseCase<CreateProductDTO, Product> {
    constructor(
        @inject(ProductRepositoryToken) private readonly productRepository: IProductRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(CategoryRepositoryToken) private readonly categoryRepository: ICategoryRepository,
        @inject(AuditRecorder) private readonly auditRecorder: AuditRecorder
    ) {}

    async execute(request: CreateProductDTO): Promise<Product> {
        const organization = await this.organizationRepository.findById(request.organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        if (request.categoryId) {
            const category = await this.categoryRepository.findById(request.categoryId);
            if (!category) {
                throw new AppError('Categoría no encontrada', 404);
            }
            if (category.props.organizationId !== request.organizationId) {
                throw new AppError('La categoría no pertenece a esta organización', 400);
            }
        }

        let internalCode = request.internalCode?.trim();
        if (!internalCode) {
            const prefix = (request.internalCodePrefix?.trim() || 'PROD').toUpperCase();
            if (prefix.length === 0) {
                throw new AppError('El prefijo del código interno no puede estar vacío', 400);
            }
            const nextSeq = await this.productRepository.getNextSequenceForPrefix(
                request.organizationId,
                prefix
            );
            internalCode = `${prefix}-${String(nextSeq).padStart(4, '0')}`;
        }

        const internalCodeExists = await this.productRepository.existsByInternalCodeAndOrganization(
            request.organizationId,
            internalCode
        );
        if (internalCodeExists) {
            throw new AppError(
                `Ya existe un producto con el código interno "${internalCode}" en esta organización`
            );
        }

        if (request.barcode && request.barcode.trim() !== '') {
            const barcodeExists = await this.productRepository.existsByBarcodeAndOrganization(
                request.organizationId,
                request.barcode.trim()
            );
            if (barcodeExists) {
                throw new AppError(
                    `Ya existe un producto con el código de barras "${request.barcode}" en esta organización`
                );
            }
        }

        const nameNormalized = request.name.trim().toUpperCase();
        const nameExists = await this.productRepository.existsByNameAndOrganization(
            request.organizationId,
            nameNormalized
        );
        if (nameExists) {
            throw new AppError(
                `Ya existe un producto con el nombre "${request.name.trim()}" en esta organización`
            );
        }

        const product = Product.create({
            internalCode,
            barcode: request.barcode ?? null,
            name: request.name,
            description: request.description ?? null,
            salePrice: request.salePrice,
            costPrice: request.costPrice ?? 0,
            unitOfMeasure: request.unitOfMeasure ?? '94',
            taxType: (request.taxType as TaxType) ?? TaxType.EXCLUIDO,
            taxPercentage: request.taxPercentage ?? 0,
            stock: request.stock ?? 0,
            minStock: request.minStock ?? 0,
            isActive: request.isActive ?? true,
            categoryId: request.categoryId ?? null,
            organizationId: request.organizationId,
        });

        await this.productRepository.save(product);
        await this.auditRecorder.recordIfUser(request.performedByUserId, {
            action: 'CREATE',
            entity: 'Product',
            entityId: product.id,
            newValues: { name: product.props.name, salePrice: product.props.salePrice, organizationId: product.props.organizationId },
            organizationId: product.props.organizationId,
        });
        return product;
    }
}
