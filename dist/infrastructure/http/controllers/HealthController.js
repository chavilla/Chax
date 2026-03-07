"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const tsyringe_1 = require("tsyringe");
const CheckHealthUseCase_1 = require("../../../shared/application/useCases/CheckHealthUseCase");
let HealthController = class HealthController {
    checkHealthUseCase;
    constructor(checkHealthUseCase) {
        this.checkHealthUseCase = checkHealthUseCase;
    }
    async check(req, res) {
        const healthStatus = await this.checkHealthUseCase.execute();
        if (healthStatus.status === 'ERROR' || healthStatus.database === 'Disconnected') {
            res.status(503).json(healthStatus);
            return;
        }
        res.status(200).json(healthStatus);
    }
};
exports.HealthController = HealthController;
exports.HealthController = HealthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [CheckHealthUseCase_1.CheckHealthUseCase])
], HealthController);
