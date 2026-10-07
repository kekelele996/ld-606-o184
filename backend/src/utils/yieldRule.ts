import type { BerthPlan } from "../models/BerthPlan";

// 让步口径（与前端页面、README 保持一致）：
// 同一泊位时间区间相撞时，优先级数值高者保留；优先级相同，计划编号小者（先编排的）保留。
// 压港（CONFLICT）只标记在让步方一条计划上。
export const YIELD_RULE_TEXT = "同一泊位时间相撞时，优先级数值高者保留；优先级相同，计划编号小者保留；压港只标在让步方";

export const pickYieldPlanId = (a: BerthPlan, b: BerthPlan): number => {
  if (a.priority !== b.priority) return a.priority > b.priority ? b.id : a.id;
  return a.id < b.id ? b.id : a.id;
};
