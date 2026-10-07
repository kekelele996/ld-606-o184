import type { AuditLog } from "../models/BerthPlan";

const records: AuditLog[] = [];
let nextId = 1;

export const auditLogRepository = {
  append(entry: Omit<AuditLog, "id" | "created_at">): AuditLog {
    const record: AuditLog = {
      id: nextId++,
      created_at: new Date().toISOString(),
      ...entry
    };
    records.unshift(record);
    return record;
  },
  findAll(targetType?: string, targetId?: string): AuditLog[] {
    return records.filter(
      (row) =>
        (targetType === undefined || row.target_type === targetType) &&
        (targetId === undefined || row.target_id === String(targetId))
    );
  }
};
