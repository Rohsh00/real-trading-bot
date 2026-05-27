"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditRouter = void 0;
const express_1 = require("express");
const audit_controller_1 = require("../controllers/audit.controller");
exports.auditRouter = (0, express_1.Router)();
exports.auditRouter.get("/", audit_controller_1.AuditController.getRecent);
