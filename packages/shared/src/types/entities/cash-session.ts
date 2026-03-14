export interface CashSessionProps {
  openingAmount: number;
  closingAmount?: number | null;
  expectedAmount?: number | null;
  difference?: number | null;
  totalCash?: number | null;
  totalCard?: number | null;
  totalTransfer?: number | null;
  openedAt: Date;
  closedAt?: Date | null;
  notes?: string | null;
  isClosed: boolean;
  userId: string;
  organizationId: string;
}

/** Forma de CashSession en respuestas API / frontend */
export interface CashSession extends CashSessionProps {
  id: string;
}
