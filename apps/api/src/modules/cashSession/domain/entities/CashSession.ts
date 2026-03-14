import { Entity } from '../../../../shared/core/Entity';
import type { CashSessionProps } from '@chax/shared';

export type { CashSessionProps } from '@chax/shared';

export class CashSession extends Entity<CashSessionProps> {
    private constructor(props: CashSessionProps, id?: string) {
        super(props, id);
    }

    public static create(props: CashSessionProps, id?: string): CashSession {
        if (!props.organizationId?.trim()) {
            throw new Error('La sesión de caja debe pertenecer a una organización');
        }
        if (!props.userId?.trim()) {
            throw new Error('La sesión de caja debe tener un usuario');
        }
        if (props.openingAmount < 0) {
            throw new Error('El monto de apertura no puede ser negativo');
        }
        return new CashSession(
            {
                ...props,
                isClosed: props.isClosed ?? false,
                openedAt: props.openedAt ?? new Date(),
            },
            id
        );
    }
}
