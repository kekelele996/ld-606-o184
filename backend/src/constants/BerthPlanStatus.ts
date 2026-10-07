export const BerthPlanStatus = ["DRAFT","CONFLICT","APPROVED","BERTHING","DEPARTED","CANCELLED"] as const;
export type BerthPlanStatus = (typeof BerthPlanStatus)[number];

// 参与泊位冲突重算的状态：这些状态仍占用泊位时间窗。
// CANCELLED / DEPARTED 不再占用泊位，不参与相撞判定。
export const BERTH_PLAN_ACTIVE_STATUSES: readonly BerthPlanStatus[] = ["DRAFT", "CONFLICT", "APPROVED", "BERTHING"];
