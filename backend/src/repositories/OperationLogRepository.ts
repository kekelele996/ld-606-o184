import type { OperationLog } from "../models/OperationLog";

// 操作日志内存表：冲突重算、改期、审批都会追加记录。
const rows: OperationLog[] = [];
let nextId = 1;

export const operationLogRepository = {
  append: (entry: Omit<OperationLog, "id" | "created_at">): OperationLog => {
    const row: OperationLog = { id: nextId++, created_at: new Date().toISOString(), ...entry };
    rows.push(row);
    return row;
  },
  findAll: (): OperationLog[] => [...rows].sort((a, b) => b.id - a.id)
};
