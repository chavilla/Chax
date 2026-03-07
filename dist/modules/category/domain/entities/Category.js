"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const Entity_1 = require("../../../../shared/core/Entity");
class Category extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        if (!props.name || props.name.trim().length === 0) {
            throw new Error('Category must have a name');
        }
        if (!props.organizationId || props.organizationId.trim().length === 0) {
            throw new Error('Category must belong to an organization');
        }
        return new Category(props, id);
    }
}
exports.Category = Category;
