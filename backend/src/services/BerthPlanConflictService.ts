import { CONFLICT_EXEMPT_STATUSES, comparePlanPriority } from "../constants/priority";
import type { BerthPlan, BerthPlanConflict, BerthPlanRow } from "../models/BerthPlan";
import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import { berthRepository } from "../repositories/BerthRepository";
import { auditLogService, type AuditActor } from "./AuditLogService";

// 半开区间相撞：[arrival, departure)，首尾相接不算压港
const overlaps = (a: BerthPlan, b: BerthPlan) =>
  a.berth_id === b.berth_id &&
  new Date(a.planned_arrival).getTime() < new Date(b.planned_departure).getTime() &&
  new Date(b.planned_arrival).getTime() < new Date(a.planned_departure).getTime();

const isActive = (plan: BerthPlan) => !CONFLICT_EXEMPT_STATUSES.has(plan.status);

// 让步口径说明：同泊位时间相撞时，为什么由 yielder 让行
export const describeYieldRule = (yielder: BerthPlan, holder: BerthPlan): string => {
  if (yielder.priority !== holder.priority) {
    return `优先级 ${yielder.priority} 低于 ${holder.priority}，低级让高级`;
  }
  return `优先级同为 ${yielder.priority}，编号 #${yielder.id} 大于 #${holder.id}，编号大者让编号小者`;
};

export interface YieldMark {
  plan: BerthPlan;
  other: BerthPlan;
  reason: string;
  yieldRule: string;
}

// 纯计算：对每条计划找出它需要让行的那一组相撞，只在让步方挂压港标记
export const computeYields = (source: BerthPlan[]): Map<number, YieldMark> => {
  const active = source.filter(isActive);
  const yields = new Map<number, YieldMark>();
  for (let i = 0; i < active.length; i += 1) {
    for (let j = i + 1; j < active.length; j += 1) {
      const a = active[i];
      const b = active[j];
      if (!overlaps(a, b)) continue;
      // comparePlanPriority 小者保留，大者让步，保证一条相撞只标一条
      const [holder, yielder] = comparePlanPriority(a, b) <= 0 ? [a, b] : [b, a];
      const yieldRule = describeYieldRule(yielder, holder);
      const reason = `与计划#${holder.id} 在泊位 ${berthRepository.codeOf(holder.berth_id)} 时间相撞：${yieldRule}，请改期`;
      // 一条计划撞多条时，保留让行口径最直接的第一条（编号最小对方）
      if (!yields.has(yielder.id)) {
        yields.set(yielder.id, { plan: yielder, other: holder, reason, yieldRule });
      }
    }
  }
  return yields;
};

const toConflictDto = (mark: YieldMark): BerthPlanConflict => ({
  plan_id: mark.plan.id,
  other_plan_id: mark.other.id,
  berth_id: mark.plan.berth_id,
  berth_code: berthRepository.codeOf(mark.plan.berth_id),
  reason: mark.reason
});

export interface RecomputeResult {
  rows: BerthPlanRow[];
  marked: YieldMark[];
  cleared: BerthPlan[];
}

export const berthPlanConflictService = {
  // 压港重算：压港只落在让步方；解除压港的退回草稿，再走审批
  recompute(actor?: AuditActor): RecomputeResult {
    const plans = berthPlanRepository.findAll();
    const before = new Map(plans.map((plan) => [plan.id, plan.status]));
    const yieldMap = computeYields(plans);
    const marked: YieldMark[] = [];
    const cleared: BerthPlan[] = [];

    yieldMap.forEach((mark) => {
      const previous = before.get(mark.plan.id);
      berthPlanRepository.update(mark.plan.id, { status: "CONFLICT" });
      marked.push(mark);
      if (actor && previous !== "CONFLICT") {
        auditLogService.record({
          actor,
          action: "BerthPlanConflictDetected",
          targetId: mark.plan.id,
          params: {
            planId: mark.plan.id,
            otherPlanId: mark.other.id,
            berthCode: berthRepository.codeOf(mark.plan.berth_id),
            yieldRule: mark.yieldRule
          }
        });
      }
    });

    plans.forEach((plan) => {
      if (plan.status === "CONFLICT" && !yieldMap.has(plan.id)) {
        berthPlanRepository.update(plan.id, { status: "DRAFT" });
        cleared.push(plan);
        if (actor && before.get(plan.id) === "CONFLICT") {
          auditLogService.record({
            actor,
            action: "BerthPlanConflictCleared",
            targetId: plan.id,
            params: { planId: plan.id }
          });
        }
      }
    });

    return { rows: this.buildRows(), marked, cleared };
  },

  buildRows(): BerthPlanRow[] {
    const plans = berthPlanRepository.findAll();
    const yieldMap = computeYields(plans);
    return plans.map((plan) => ({
      ...plan,
      in_conflict: yieldMap.has(plan.id),
      conflict_with: yieldMap.has(plan.id) ? toConflictDto(yieldMap.get(plan.id)!) : null
    }));
  }
};
