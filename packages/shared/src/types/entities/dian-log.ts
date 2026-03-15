export interface DianLogProps {
  action: string;
  requestXml?: string | null;
  responseXml?: string | null;
  statusCode?: number | null;
  dianResponseCode?: string | null;
  success: boolean;
  errorMessage?: string | null;
  invoiceId: string;
  createdAt?: Date;
}

/** Forma de DianLog en respuestas API (solo lectura). */
export interface DianLog extends DianLogProps {
  id: string;
}
