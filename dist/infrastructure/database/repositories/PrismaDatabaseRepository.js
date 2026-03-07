"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDatabaseRepository = void 0;
const tsyringe_1 = require("tsyringe");
const prisma_1 = require("../prisma");
let PrismaDatabaseRepository = class PrismaDatabaseRepository {
    async checkConnection() {
        try {
            await prisma_1.prisma.$queryRaw `SELECT 1`;
            return true;
        }
        catch (error) {
            console.error('Database connection error:', error);
            throw error; // Re-lanzar para que el health check pueda mostrar el mensaje
        }
    }
};
exports.PrismaDatabaseRepository = PrismaDatabaseRepository;
exports.PrismaDatabaseRepository = PrismaDatabaseRepository = __decorate([
    (0, tsyringe_1.injectable)()
], PrismaDatabaseRepository);
