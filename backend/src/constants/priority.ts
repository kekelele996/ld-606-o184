import type { BerthPlan } from "../models/BerthPlan";

// 压港让行口径：优先级数字小者优先（数字越小等级越高）；
// 优先级相同则计划编号小者优先（先编先排，编号大的让编号小的）。
export const PRIORITY_RANK: Record<string, number> = {
  HIGH: 1,
  NORMAL: 2,
  LOW: 3
};

export const DEFAULT_PRIORITY = "NORMAL";

// 已取消、已离泊的计划不再占用泊位，不参与压港计算。
export const CONFLICT_EXEMPT_STATUSES: ReadonlySet<string> = new Set(["CANCELLED", "DEPARTED"]);

export const comparePlanPriority = (a: BerthPlan, b: BerthPlan): number => {
  const rankA = PRIORITY_RANK[a.priority] ?? PRIORITY_RANK[DEFAULT_PRIORITY];
  const rankB = PRIORITY_RANK[b.priority] ?? PRIORITY_RANK[DEFAULT_PRIORITY];
  if (rankA !== rankB) return rankA - rankB;
  return a.id - b.id;
};
