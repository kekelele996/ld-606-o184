import { CONFLICT_EXEMPT_STATUSES, comparePlanPriority } from "../constants/priority";
import type { BerthPlan } from "../types/BerthPlan";

export interface BerthConflictPair {
  yielder: BerthPlan;
  holder: BerthPlan;
  berthId: number;
  yieldRule: string;
}

// 半开区间 [arrival, departure)，首尾相接不算相撞
const overlaps = (a: BerthPlan, b: BerthPlan) =>
  a.berth_id === b.berth_id &&
  new Date(a.planned_arrival).getTime() < new Date(b.planned_departure).getTime() &&
  new Date(b.planned_arrival).getTime() < new Date(a.planned_departure).getTime();

const describeYieldRule = (yielder: BerthPlan, holder: BerthPlan): string => {
  if (yielder.priority !== holder.priority) {
    return `优先级 ${yielder.priority} 低于 ${holder.priority}，低级让高级`;
  }
  return `优先级同为 ${yielder.priority}，编号 #${yielder.id} 大于 #${holder.id}，编号大者让编号小者`;
};

// 压港只标让步方一条：同一泊位相撞时按“优先级、再编号”口径二选一
export function useBerthConflict<T extends BerthPlan>(rows: T[] = []): {
  pairs: BerthConflictPair[];
  conflictPlanIds: Set<number>;
  total: number;
} {
  const active = rows.filter((row) => !CONFLICT_EXEMPT_STATUSES.has(row.status));
  const pairs: BerthConflictPair[] = [];
  const conflictPlanIds = new Set<number>();

  for (let i = 0; i < active.length; i += 1) {
    for (let j = i + 1; j < active.length; j += 1) {
      const a = active[i];
      const b = active[j];
      if (!overlaps(a, b)) continue;
      const [holder, yielder] = comparePlanPriority(a, b) <= 0 ? [a, b] : [b, a];
      if (!conflictPlanIds.has(yielder.id)) {
        conflictPlanIds.add(yielder.id);
        pairs.push({ yielder, holder, berthId: yielder.berth_id, yieldRule: describeYieldRule(yielder, holder) });
      }
    }
  }

  return { pairs, conflictPlanIds, total: rows.length };
}
