import { Entity } from '../../../../shared/core/Entity';
import type { CategoryProps } from '@chax/shared';

export type { CategoryProps } from '@chax/shared';

export class Category extends Entity<CategoryProps> {
    private constructor(props: CategoryProps, id?: string) {
        super(props, id);
    }

    public static create(props: CategoryProps, id?: string): Category {
        if (!props.name || props.name.trim().length === 0) {
            throw new Error('Category must have a name');
        }
        if (!props.organizationId || props.organizationId.trim().length === 0) {
            throw new Error('Category must belong to an organization');
        }
        return new Category(props, id);
    }
}
