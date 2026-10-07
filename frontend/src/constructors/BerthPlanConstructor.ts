import { DEFAULT_PRIORITY } from "../constants/priority";
import type { BerthPlan, BerthPlanRow } from "../types/BerthPlan";

// 新编排计划默认草稿，压港由后端计算后再标，不靠页面散写默认结构
export const createDefaultBerthPlan = (overrides: Partial<BerthPlan> = {}): BerthPlan => ({
  id: 0,
  vessel_id: 0,
  berth_id: 0,
  planned_arrival: "",
  planned_departure: "",
  priority: DEFAULT_PRIORITY,
  status: "DRAFT",
  dispatcher_id: 1,
  ...overrides
});

export const createBerthPlanForm = createDefaultBerthPlan;

export const createBerthPlanResponse = (plan: BerthPlan): BerthPlanRow => ({
  ...createDefaultBerthPlan(plan),
  in_conflict: false,
  conflict_with: null
});
