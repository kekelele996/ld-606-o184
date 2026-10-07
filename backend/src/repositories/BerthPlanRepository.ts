import type { BerthPlan } from "../models/BerthPlan";

// 本地种子数据（对应 database/init.sql）。初始状态不预设压港，
// 由 berthPlanConflictService 在首次计算时按统一口径落状态。
const plans: BerthPlan[] = [
  { id: 1, vessel_id: 1, berth_id: 1, planned_arrival: "2026-10-10T08:00:00", planned_departure: "2026-10-10T20:00:00", priority: "HIGH", status: "APPROVED", dispatcher_id: 1 },
  { id: 2, vessel_id: 2, berth_id: 1, planned_arrival: "2026-10-10T14:00:00", planned_departure: "2026-10-11T08:00:00", priority: "NORMAL", status: "DRAFT", dispatcher_id: 1 },
  { id: 3, vessel_id: 3, berth_id: 2, planned_arrival: "2026-10-10T10:00:00", planned_departure: "2026-10-11T10:00:00", priority: "HIGH", status: "APPROVED", dispatcher_id: 1 },
  { id: 4, vessel_id: 4, berth_id: 2, planned_arrival: "2026-10-11T06:00:00", planned_departure: "2026-10-11T22:00:00", priority: "HIGH", status: "DRAFT", dispatcher_id: 1 },
  { id: 5, vessel_id: 5, berth_id: 2, planned_arrival: "2026-10-11T18:00:00", planned_departure: "2026-10-12T18:00:00", priority: "LOW", status: "DRAFT", dispatcher_id: 1 },
  { id: 6, vessel_id: 6, berth_id: 3, planned_arrival: "2026-10-11T09:00:00", planned_departure: "2026-10-12T09:00:00", priority: "NORMAL", status: "APPROVED", dispatcher_id: 1 }
];

let nextId = 7;

export const berthPlanRepository = {
  findAll: (): BerthPlan[] => plans.map((row) => ({ ...row })),
  findById: (id: number): BerthPlan | undefined => plans.find((row) => row.id === id),
  insert(row: Omit<BerthPlan, "id">): BerthPlan {
    const record: BerthPlan = { id: nextId++, ...row };
    plans.push(record);
    return { ...record };
  },
  update(id: number, patch: Partial<BerthPlan>): BerthPlan | undefined {
    const target = plans.find((row) => row.id === id);
    if (!target) return undefined;
    Object.assign(target, patch);
    return { ...target };
  }
};
