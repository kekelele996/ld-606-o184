import type { Berth } from "../models/Berth";

// 本地种子数据（对应 database/init.sql）
const berths: Berth[] = [
  { id: 1, berth_code: "A01", length_m: 300, water_depth_m: 15, berth_type: "DEEP", current_status: "OPEN", safety_note: "深水泊位，高潮位靠泊" },
  { id: 2, berth_code: "A02", length_m: 240, water_depth_m: 12, berth_type: "GENERAL", current_status: "OPEN", safety_note: "" },
  { id: 3, berth_code: "B01", length_m: 210, water_depth_m: 10.5, berth_type: "GENERAL", current_status: "MAINTENANCE", safety_note: "10 月例行维护" }
];

export const berthRepository = {
  findAll: (): Berth[] => berths,
  findById: (id: number): Berth | undefined => berths.find((row) => row.id === id),
  codeOf: (id: number): string => berths.find((row) => row.id === id)?.berth_code ?? `#${id}`,
  save: (row: unknown): Berth => {
    const record = row as Berth;
    berths.push({ ...record, id: record.id ?? berths.length + 1 });
    return record;
  }
};
