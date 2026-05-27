import { Router } from "express";
import { AuditController } from "../controllers/audit.controller";

export const auditRouter = Router();

auditRouter.get("/", AuditController.getRecent);
