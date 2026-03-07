import { Entity } from '../../../../shared/core/Entity';
import { UserRole } from '@prisma/client';

export interface UserProps {
    email: string;
    password: string; // Hash de la contraseña
    name: string;
    role: UserRole;
    isActive: boolean;
    organizationId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User extends Entity<UserProps> {
    private constructor(props: UserProps, id?: string) {
        super(props, id);
    }

    public static create(props: UserProps, id?: string): User {
        if (!props.email || props.email.trim().length === 0) {
            throw new Error('User must have a valid email');
        }

        if (!props.password || props.password.trim().length === 0) {
            throw new Error('User must have a password');
        }

        if (!props.name || props.name.trim().length === 0) {
            throw new Error('User must have a name');
        }

        const user = new User(
            {
                ...props,
                role: props.role ?? ('CASHIER' as UserRole),
                isActive: props.isActive ?? true,
            },
            id
        );

        return user;
    }
}
