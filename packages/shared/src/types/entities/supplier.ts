import type { IdType } from '../../enums';

export interface SupplierProps {
  idType: IdType;
  idNumber: string;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  department?: string | null;
  notes?: string | null;
  organizationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Forma de Supplier en respuestas API / frontend */
export interface Supplier extends SupplierProps {
  id: string;
}
