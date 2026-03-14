import type { UserRole } from '../../enums';

export interface UserProps {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  organizationId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Forma de User en respuestas API / frontend (sin password) */
export interface User extends Omit<UserProps, 'password'> {
  id: string;
}
