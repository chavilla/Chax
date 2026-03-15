import { Entity } from '../../../../shared/core/Entity';
import type { DianLogProps } from '@chax/shared';

export type { DianLogProps } from '@chax/shared';

export class DianLog extends Entity<DianLogProps> {
    private constructor(props: DianLogProps, id?: string) {
        super(props, id);
    }

    public static create(props: DianLogProps, id?: string): DianLog {
        if (!props.invoiceId?.trim()) {
            throw new Error('El log debe estar asociado a una factura');
        }
        if (!props.action?.trim()) {
            throw new Error('La acción del log es requerida');
        }
        return new DianLog(props, id);
    }
}
