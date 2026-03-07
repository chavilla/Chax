"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Entity_1 = require("../../../../shared/core/Entity");
class User extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        if (!props.email || props.email.trim().length === 0) {
            throw new Error('User must have a valid email');
        }
        if (!props.password || props.password.trim().length === 0) {
            throw new Error('User must have a password');
        }
        if (!props.name || props.name.trim().length === 0) {
            throw new Error('User must have a name');
        }
        const user = new User({
            ...props,
            role: props.role ?? 'CASHIER',
            isActive: props.isActive ?? true,
        }, id);
        return user;
    }
}
exports.User = User;
