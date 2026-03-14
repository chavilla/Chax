export interface CategoryProps {
  name: string;
  description?: string | null;
  organizationId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Forma de Category en respuestas API / frontend */
export interface Category extends CategoryProps {
  id: string;
}
