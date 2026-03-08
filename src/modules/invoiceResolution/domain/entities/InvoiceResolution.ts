import { Entity } from '../../../../shared/core/Entity';

export interface InvoiceResolutionProps {
    name?: string | null;
    resolutionNumber?: string | null;
    prefix: string;
    rangeStart: number;
    rangeEnd: number;
    currentNumber: number;
    startDate?: Date | null;
    endDate?: Date | null;
    technicalKey?: string | null;
    isActive: boolean;
    organizationId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class InvoiceResolution extends Entity<InvoiceResolutionProps> {
    private constructor(props: InvoiceResolutionProps, id?: string) {
        super(props, id);
    }

    public static create(props: InvoiceResolutionProps, id?: string): InvoiceResolution {
        const prefix = props.prefix?.trim() ?? '';
        if (prefix.length === 0) {
            throw new Error('El prefijo es requerido');
        }
        if (prefix.length > 20) {
            throw new Error('El prefijo no puede exceder 20 caracteres');
        }

        if (props.rangeStart > props.rangeEnd) {
            throw new Error('rangeStart no puede ser mayor que rangeEnd');
        }
        if (props.currentNumber < props.rangeStart || props.currentNumber > props.rangeEnd) {
            throw new Error('currentNumber debe estar entre rangeStart y rangeEnd');
        }

        if (props.startDate && props.endDate && props.startDate > props.endDate) {
            throw new Error('startDate no puede ser posterior a endDate');
        }

        if (!props.organizationId?.trim()) {
            throw new Error('La resolución debe pertenecer a una organización');
        }

        return new InvoiceResolution(
            {
                ...props,
                isActive: props.isActive ?? true,
            },
            id
        );
    }
}
