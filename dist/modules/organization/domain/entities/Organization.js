"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
const Entity_1 = require("../../../../shared/core/Entity");
const client_1 = require("@prisma/client");
class Organization extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        // Here we can add domain validations that must always be true for an Organization
        if (!props.nit || props.nit.trim().length === 0) {
            throw new Error('Organization must have a valid NIT');
        }
        if (!props.businessName || props.businessName.trim().length === 0) {
            throw new Error('Organization must have a business name');
        }
        const organization = new Organization({
            ...props,
            taxRegime: props.taxRegime || client_1.TaxRegime.NO_RESPONSABLE_IVA,
            usesDian: props.usesDian || false,
        }, id);
        return organization;
    }
}
exports.Organization = Organization;
