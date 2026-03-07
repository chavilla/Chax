"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHealthRouter = createHealthRouter;
const express_1 = require("express");
function createHealthRouter(healthController) {
    const router = (0, express_1.Router)();
    router.get('/', (req, res) => healthController.check(req, res));
    return router;
}
