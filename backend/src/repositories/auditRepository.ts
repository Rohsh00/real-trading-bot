import { prisma } from "../core/database";
import { AuditLog } from "@prisma/client";

export class AuditRepository {
  static async create(data: {
    id: string;
    event_type: string;
    event_name: string;
    entity_id?: string | null;
    details?: any;
  }): Promise<AuditLog> {
    return prisma.auditLog.create({
      data,
    });
  }

  static async getRecent(limit: number = 100): Promise<AuditLog[]> {
    return prisma.auditLog.findMany({
      orderBy: {
        created_at: "desc",
      },
      take: limit,
    });
  }
}
export default AuditRepository;
