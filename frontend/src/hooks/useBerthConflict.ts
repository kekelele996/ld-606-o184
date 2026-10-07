import type { BerthPlan, BerthPlanConflictPair } from "../types/BerthPlan";

export interface BerthConflictView {
  /** 是否为让步方（压港只标在这一条上） */
  loser: boolean;
  /** 相撞时被保留的另一条计划编号 */
  keeperId: number | null;
  overlapStart: string | null;
  overlapEnd: string | null;
}

export interface BerthConflictResult {
  view: Map<number, BerthConflictView>;
  total: number;
}

// 把后端算好的冲突对摊平成 planId -> 展示视图，页面只负责读。
export function useBerthConflict(plans: BerthPlan[] = [], pairs: BerthPlanConflictPair[] = []): BerthConflictResult {
  const view = new Map<number, BerthConflictView>();
  for (const pair of pairs) {
    view.set(pair.loser_id, {
      loser: true,
      keeperId: pair.keeper_id,
      overlapStart: pair.overlap_start,
      overlapEnd: pair.overlap_end
    });
    if (!view.has(pair.keeper_id)) {
      view.set(pair.keeper_id, { loser: false, keeperId: pair.loser_id, overlapStart: pair.overlap_start, overlapEnd: pair.overlap_end });
    }
  }
  return { view, total: pairs.length };
}
