export interface AuditLogProps {
  action: string;
  entity: string;
  entityId: string;
  oldValues?: string | null;
  newValues?: string | null;
  ipAddress?: string | null;
  userId: string;
  organizationId: string;
  createdAt?: Date;
}

/** Forma de AuditLog en respuestas API (solo lectura). */
export interface AuditLog extends AuditLogProps {
  id: string;
}
