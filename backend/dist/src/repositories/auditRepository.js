"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditRepository = void 0;
const database_1 = require("../core/database");
class AuditRepository {
    static async create(data) {
        return database_1.prisma.auditLog.create({
            data,
        });
    }
    static async getRecent(limit = 100) {
        return database_1.prisma.auditLog.findMany({
            orderBy: {
                created_at: "desc",
            },
            take: limit,
        });
    }
}
exports.AuditRepository = AuditRepository;
exports.default = AuditRepository;
