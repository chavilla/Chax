"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const Entity_1 = require("../../../../shared/core/Entity");
const client_1 = require("@prisma/client");
class Customer extends Entity_1.Entity {
    constructor(props, id) {
        super(props, id);
    }
    static create(props, id) {
        const trimmedId = props.idNumber?.trim() ?? '';
        if (trimmedId.length === 0) {
            throw new Error('El cliente debe tener un número de documento');
        }
        if (trimmedId.length < 5 || trimmedId.length > 20) {
            throw new Error('El número de documento debe tener entre 5 y 20 caracteres');
        }
        const trimmedName = props.name?.trim() ?? '';
        if (trimmedName.length === 0) {
            throw new Error('El cliente debe tener un nombre');
        }
        if (trimmedName.length < 5) {
            throw new Error('El nombre debe tener al menos 5 caracteres');
        }
        const nameParts = trimmedName.split(/\s+/).filter(Boolean);
        if (nameParts.length < 2) {
            throw new Error('Debe incluir al menos nombre y apellido');
        }
        if (!props.organizationId || props.organizationId.trim().length === 0) {
            throw new Error('El cliente debe pertenecer a una organización');
        }
        return new Customer({
            ...props,
            idType: props.idType ?? client_1.IdType.CC,
            taxRegime: props.taxRegime ?? client_1.TaxRegime.NO_RESPONSABLE_IVA,
        }, id);
    }
}
exports.Customer = Customer;
