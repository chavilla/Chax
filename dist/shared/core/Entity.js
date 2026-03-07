"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const crypto_1 = __importDefault(require("crypto"));
class Entity {
    _id;
    props;
    get id() {
        return this._id;
    }
    constructor(props, id) {
        this._id = id ? id : crypto_1.default.randomUUID();
        this.props = props;
    }
    equals(object) {
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
exports.Entity = Entity;
const isEntity = (v) => {
    return v instanceof Entity;
};
