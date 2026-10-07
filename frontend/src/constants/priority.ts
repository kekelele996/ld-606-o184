import type { BerthPlan } from "../types/BerthPlan";

// 与后端 constants/priority.ts 保持一致的让行口径：
// 优先级数字小者优先（等级更高）；同优先级编号小者优先（先编先排）。
export const PRIORITY_RANK: Record<string, number> = {
  HIGH: 1,
  NORMAL: 2,
  LOW: 3
};

export const PRIORITY_OPTIONS = [
  { value: "HIGH", label: "高优先级" },
  { value: "NORMAL", label: "常规" },
  { value: "LOW", label: "低优先级" }
] as const;

export const PRIORITY_TEXT: Record<string, string> = {
  HIGH: "高",
  NORMAL: "常规",
  LOW: "低"
};

export const DEFAULT_PRIORITY = "NORMAL";

export const CONFLICT_EXEMPT_STATUSES: ReadonlySet<string> = new Set(["CANCELLED", "DEPARTED"]);

export const comparePlanPriority = (a: BerthPlan, b: BerthPlan): number => {
  const rankA = PRIORITY_RANK[a.priority] ?? PRIORITY_RANK.NORMAL;
  const rankB = PRIORITY_RANK[b.priority] ?? PRIORITY_RANK.NORMAL;
  if (rankA !== rankB) return rankA - rankB;
  return a.id - b.id;
};
