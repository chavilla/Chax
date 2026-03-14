import { injectable, inject } from 'tsyringe';
import { UseCase } from '../../../shared/core/UseCase';
import { IInvoiceRepository, InvoiceItemToPersist, PaymentToPersist } from '../domain/repositories/IInvoiceRepository';
import { IOrganizationRepository } from '../../organization/domain/repositories/IOrganizationRepository';
import { ICustomerRepository } from '../../customer/domain/repositories/ICustomerRepository';
import { IUserRepository } from '../../user/domain/repositories/IUserRepository';
import { IInvoiceResolutionRepository } from '../../invoiceResolution/domain/repositories/IInvoiceResolutionRepository';
import { IProductRepository } from '../../product/domain/repositories/IProductRepository';
import { Invoice } from '../domain/entities/Invoice';
import { calculateInvoiceItemTotals } from '../domain/entities/InvoiceItem';
import { AppError } from '../../../shared/errors/AppError';
import {
    OrganizationRepositoryToken,
    CustomerRepositoryToken,
    UserRepositoryToken,
    InvoiceResolutionRepositoryToken,
    ProductRepositoryToken,
    InvoiceRepositoryToken,
} from '../../../shared/container/tokens';
import { InvoiceType, DianStatus, PaymentStatus } from '@chax/shared';
import type { CreateInvoiceDTO } from '../dtos/invoice.dtos';

export type CreateInvoiceResult = { invoice: Invoice; warning?: string };

@injectable()
export class CreateInvoiceUseCase implements UseCase<CreateInvoiceDTO, CreateInvoiceResult> {
    constructor(
        @inject(InvoiceRepositoryToken) private readonly invoiceRepository: IInvoiceRepository,
        @inject(OrganizationRepositoryToken) private readonly organizationRepository: IOrganizationRepository,
        @inject(CustomerRepositoryToken) private readonly customerRepository: ICustomerRepository,
        @inject(UserRepositoryToken) private readonly userRepository: IUserRepository,
        @inject(InvoiceResolutionRepositoryToken) private readonly resolutionRepository: IInvoiceResolutionRepository,
        @inject(ProductRepositoryToken) private readonly productRepository: IProductRepository
    ) {}

    async execute(request: CreateInvoiceDTO): Promise<CreateInvoiceResult> {
        const organizationId = request.organizationId;
        const organization = await this.organizationRepository.findById(organizationId);
        if (!organization) {
            throw new AppError('Organización no encontrada', 404);
        }

        const customer = await this.customerRepository.findById(request.customerId);
        if (!customer) {
            throw new AppError('Cliente no encontrado', 404);
        }
        if (customer.props.organizationId !== organizationId) {
            throw new AppError('El cliente no pertenece a esta organización', 400);
        }

        const createdByUser = await this.userRepository.findById(request.createdByUserId);
        if (!createdByUser) {
            throw new AppError('Usuario no encontrado', 404);
        }

        let invoiceNumber: string;
        let resolutionUpdate: { resolutionId: string; newCurrentNumber: number } | null = null;
        let isLastInResolution = false;

        if (request.resolutionId) {
            const resolution = await this.resolutionRepository.findById(request.resolutionId);
            if (!resolution) {
                throw new AppError('Resolución de facturación no encontrada', 404);
            }
            if (resolution.props.organizationId !== organizationId) {
                throw new AppError('La resolución no pertenece a esta organización', 400);
            }
            if (!resolution.props.isActive) {
                throw new AppError('La resolución no está activa', 400);
            }
            if (resolution.props.currentNumber > resolution.props.rangeEnd) {
                throw new AppError('La resolución ha agotado el rango de numeración', 400);
            }
            const num = resolution.props.currentNumber;
            if (num === resolution.props.rangeEnd) {
                isLastInResolution = true;
            }
            const padded = String(num).padStart(6, '0');
            invoiceNumber = `${resolution.props.prefix}-${padded}`;
            resolutionUpdate = { resolutionId: resolution.id, newCurrentNumber: num + 1 };
        } else {
            throw new AppError('La resolución de facturación (resolutionId) es obligatoria para emitir una factura', 400);
        }

        const type = request.type ?? InvoiceType.FACTURA;
        const itemsToPersist: InvoiceItemToPersist[] = [];
        const productStockUpdates: { productId: string; newStock: number }[] = [];
        const stockMovements: {
            productId: string;
            quantity: number;
            previousStock: number;
            newStock: number;
            unitCost?: number | null;
            organizationId: string;
        }[] = [];

        let subtotalSum = 0;
        let taxTotalSum = 0;
        let discountTotalSum = 0;

        for (const item of request.items) {
            const product = await this.productRepository.findById(item.productId);
            if (!product) {
                throw new AppError(`Producto no encontrado: ${item.productId}`, 404);
            }
            if (product.props.organizationId !== organizationId) {
                throw new AppError(`El producto ${product.props.name} no pertenece a esta organización`, 400);
            }
            if (!product.props.isActive) {
                throw new AppError(`El producto ${product.props.name} no está activo`, 400);
            }
            if (product.props.stock < item.quantity) {
                throw new AppError(
                    `Stock insuficiente para ${product.props.name}: disponible ${product.props.stock}, solicitado ${item.quantity}`,
                    400
                );
            }

            const unitPrice = item.unitPrice ?? product.props.salePrice;
            const discount = item.discount ?? 0;
            const taxPercentage = item.taxPercentage ?? product.props.taxPercentage;

            const { subtotal, taxAmount, total } = calculateInvoiceItemTotals({
                quantity: item.quantity,
                unitPrice,
                discount,
                taxPercentage,
            });

            itemsToPersist.push({
                productId: product.id,
                quantity: item.quantity,
                unitPrice,
                discount,
                taxPercentage,
                taxAmount,
                subtotal,
                total,
                taxDianCode: null,
            });

            subtotalSum += subtotal;
            taxTotalSum += taxAmount;
            discountTotalSum += discount;

            const newStock = product.props.stock - item.quantity;
            productStockUpdates.push({ productId: product.id, newStock });
            stockMovements.push({
                productId: product.id,
                quantity: -item.quantity,
                previousStock: product.props.stock,
                newStock,
                unitCost: product.props.costPrice ?? null,
                organizationId,
            });
        }

        const totalInvoice = Number((subtotalSum + taxTotalSum - discountTotalSum).toFixed(2));

        const totalPaid =
            request.payments?.reduce((sum, p) => sum + Number(p.amount), 0) ?? 0;
        const paymentStatus: PaymentStatus =
            totalPaid >= totalInvoice ? PaymentStatus.PAGADA : totalPaid > 0 ? PaymentStatus.PARCIAL : PaymentStatus.PENDIENTE;

        const paymentsToPersist: PaymentToPersist[] | undefined = request.payments?.length
            ? request.payments.map((p) => ({
                  amount: Number(p.amount),
                  paymentMethod: p.paymentMethod ?? 'EFECTIVO',
                  reference: p.reference ?? null,
              }))
            : undefined;

        const invoice = Invoice.create(
            {
                type,
                invoiceNumber,
                issueDate: new Date(),
                dueDate: request.dueDate ?? null,
                subtotal: Number(subtotalSum.toFixed(2)),
                taxTotal: Number(taxTotalSum.toFixed(2)),
                discountTotal: Number(discountTotalSum.toFixed(2)),
                total: totalInvoice,
                dianStatus: organization.props.usesDian ? DianStatus.PENDIENTE : DianStatus.NO_APLICA,
                paymentStatus,
                customerId: request.customerId,
                resolutionId: request.resolutionId ?? null,
                createdByUserId: request.createdByUserId,
                cashSessionId: request.cashSessionId ?? null,
                organizationId,
                notes: request.notes ?? null,
            },
            undefined
        );

        await this.invoiceRepository.createWithItemsAndStock({
            invoice,
            items: itemsToPersist,
            resolutionUpdate,
            productStockUpdates,
            stockMovements,
            payments: paymentsToPersist,
        });

        return {
            invoice,
            warning: isLastInResolution
                ? 'Esta es la última factura permitida con esta resolución. Cree una nueva resolución para seguir facturando.'
                : undefined,
        };
    }
}
