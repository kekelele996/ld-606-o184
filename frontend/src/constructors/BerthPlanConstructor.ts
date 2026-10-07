import type { BerthPlan } from "../types/BerthPlan";
import { toLocalInputValue } from "../utils/formatters";

export const createDefaultBerthPlan = (overrides: Partial<BerthPlan> = {}): BerthPlan => ({
  id: 0,
  vessel_id: 0,
  berth_id: 0,
  planned_arrival: "",
  planned_departure: "",
  priority: 0,
  status: "DRAFT",
  dispatcher_id: 0,
  ...overrides
});

export const createBerthPlanForm = createDefaultBerthPlan;
export const createBerthPlanResponse = createDefaultBerthPlan;

export interface BerthPlanRescheduleForm {
  planned_arrival: string;
  planned_departure: string;
}

// 改期表单：datetime-local 需要本地时区的 YYYY-MM-DDTHH:mm。
export const createBerthPlanRescheduleForm = (plan: BerthPlan): BerthPlanRescheduleForm => ({
  planned_arrival: toLocalInputValue(plan.planned_arrival),
  planned_departure: toLocalInputValue(plan.planned_departure)
});
