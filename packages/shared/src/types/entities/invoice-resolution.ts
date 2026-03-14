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

/** Forma de InvoiceResolution en respuestas API / frontend */
export interface InvoiceResolution extends InvoiceResolutionProps {
  id: string;
}
