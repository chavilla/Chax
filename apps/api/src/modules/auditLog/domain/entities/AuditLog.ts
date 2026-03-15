import { Entity } from '../../../../shared/core/Entity';
import type { AuditLogProps } from '@chax/shared';

export type { AuditLogProps } from '@chax/shared';

export class AuditLog extends Entity<AuditLogProps> {
    private constructor(props: AuditLogProps, id?: string) {
        super(props, id);
    }

    public static create(props: AuditLogProps, id?: string): AuditLog {
        if (!props.organizationId?.trim()) {
            throw new Error('El log de auditoría debe pertenecer a una organización');
        }
        if (!props.userId?.trim()) {
            throw new Error('El log de auditoría debe tener un usuario');
        }
        if (!props.entity?.trim() || !props.entityId?.trim()) {
            throw new Error('Entidad y entityId son requeridos');
        }
        if (!props.action?.trim()) {
            throw new Error('La acción es requerida');
        }
        return new AuditLog(props, id);
    }
}
