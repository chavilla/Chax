import { Entity } from '../../../../shared/core/Entity';
import { UserRole, type UserProps } from '@chax/shared';

export type { UserProps } from '@chax/shared';

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
        return new User(
            {
                ...props,
                role: props.role ?? UserRole.CASHIER,
                isActive: props.isActive ?? true,
            },
            id
        );
    }
}
