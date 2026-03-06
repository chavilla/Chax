import crypto from 'crypto';

export abstract class Entity<T> {
    protected readonly _id: string;
    public readonly props: T;

    get id(): string {
        return this._id;
    }

    constructor(props: T, id?: string) {
        this._id = id ? id : crypto.randomUUID();
        this.props = props;
    }

    public equals(object?: Entity<T>): boolean {
        if (object == null || object == undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }

        return this._id === object._id;
    }
}

const isEntity = (v: unknown): v is Entity<unknown> => {
    return v instanceof Entity;
};
