import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import { operationLogRepository } from "../repositories/OperationLogRepository";
import { BERTH_PLAN_ACTIVE_STATUSES } from "../constants/BerthPlanStatus";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { rangesOverlap, overlapWindow } from "../utils/timeIntervals";
import { pickYieldPlanId } from "../utils/yieldRule";
import { httpError } from "../utils/httpError";
import { createBerthPlanDto, createConflictPairDto, createOperationLogDto } from "../constructors/BerthPlanDtoFactory";
import type { BerthPlanConflictPair } from "../constructors/BerthPlanDtoFactory";
import type { BerthPlan } from "../models/BerthPlan";
import type { OperationLog } from "../models/OperationLog";
import type { BerthPlanReschedulePayload } from "../types/BerthPlanPayload";

// 最近一次重算得到的冲突对，供 GET /conflicts 与页面标记让步方使用。
let lastPairs: BerthPlanConflictPair[] = [];

const log = (action: string, entityId: number, detail: string, operatorId: number): void => {
  operationLogRepository.append({ action, entity_type: "BerthPlan", entity_id: entityId, detail, operator_id: operatorId });
};

// 冲突重算：同一泊位、时间区间相撞的计划两两比对，
// 按让步口径（优先级高者保留，平级编号小者保留）只把让步方置为 CONFLICT；
// 不再相撞的计划从 CONFLICT 恢复为 DRAFT，重新走审批。
const recalculateConflicts = (operatorId = 0): BerthPlanConflictPair[] => {
  const plans = berthPlanRepository.findAll();
  const active = plans.filter((plan) => (BERTH_PLAN_ACTIVE_STATUSES as readonly string[]).includes(plan.status));
  const pairs: BerthPlanConflictPair[] = [];

  const byBerth = new Map<number, BerthPlan[]>();
  for (const plan of active) {
    const group = byBerth.get(plan.berth_id) ?? [];
    group.push(plan);
    byBerth.set(plan.berth_id, group);
  }

  for (const [berthId, group] of byBerth) {
    const sorted = [...group].sort((a, b) => Date.parse(a.planned_arrival) - Date.parse(b.planned_arrival) || a.id - b.id);
    for (let i = 0; i < sorted.length; i++) {
      for (let j = i + 1; j < sorted.length; j++) {
        const a = sorted[i];
        const b = sorted[j];
        if (!rangesOverlap(a.planned_arrival, a.planned_departure, b.planned_arrival, b.planned_departure)) continue;
        const loserId = pickYieldPlanId(a, b);
        const keeperId = loserId === a.id ? b.id : a.id;
        const window = overlapWindow(a.planned_arrival, a.planned_departure, b.planned_arrival, b.planned_departure);
        pairs.push({ berth_id: berthId, keeper_id: keeperId, loser_id: loserId, overlap_start: window.start, overlap_end: window.end });
      }
    }
  }

  const loserIds = new Set(pairs.map((pair) => pair.loser_id));
  for (const plan of plans) {
    if (loserIds.has(plan.id)) {
      if (plan.status !== "CONFLICT") berthPlanRepository.update(plan.id, { status: "CONFLICT" });
    } else if (plan.status === "CONFLICT") {
      berthPlanRepository.update(plan.id, { status: "DRAFT" });
    }
  }

  lastPairs = pairs;
  const losers = [...loserIds].sort((x, y) => x - y);
  log(
    LOG_TEMPLATES.BerthPlan.CONFLICT_RECALCULATE,
    0,
    `压港重算完成：${pairs.length} 组相撞，让步方 ${losers.length ? losers.map((id) => `#${id}`).join("、") : "无"}`,
    operatorId
  );
  return lastPairs.map(createConflictPairDto);
};

const list = (): BerthPlan[] => berthPlanRepository.findAll().map(createBerthPlanDto);

const conflicts = (): BerthPlanConflictPair[] => lastPairs.map(createConflictPairDto);

const logs = (): OperationLog[] => operationLogRepository.findAll().map(createOperationLogDto);

const reschedule = (id: number, payload: BerthPlanReschedulePayload, operatorId: number): { plan: BerthPlan; pairs: BerthPlanConflictPair[] } => {
  const plan = berthPlanRepository.findById(id);
  if (!plan) throw httpError(404, ERROR_CODES.PLAN_NOT_FOUND, ERROR_MESSAGES.PLAN_NOT_FOUND);

  const arrival = new Date(payload?.planned_arrival ?? "");
  const departure = new Date(payload?.planned_departure ?? "");
  if (Number.isNaN(arrival.getTime()) || Number.isNaN(departure.getTime()) || arrival >= departure) {
    throw httpError(400, ERROR_CODES.INVALID_TIME_RANGE, ERROR_MESSAGES.INVALID_TIME_RANGE);
  }

  const before = `${plan.planned_arrival} ~ ${plan.planned_departure}`;
  berthPlanRepository.update(id, { planned_arrival: arrival.toISOString(), planned_departure: departure.toISOString() });
  log(LOG_TEMPLATES.BerthPlan.RESCHEDULE, id, `计划改期：${before} → ${arrival.toISOString()} ~ ${departure.toISOString()}`, operatorId);

  const pairs = recalculateConflicts(operatorId);
  const updated = berthPlanRepository.findById(id) as BerthPlan;
  return { plan: createBerthPlanDto(updated), pairs };
};

const approve = (id: number, operatorId: number): BerthPlan => {
  const plan = berthPlanRepository.findById(id);
  if (!plan) throw httpError(404, ERROR_CODES.PLAN_NOT_FOUND, ERROR_MESSAGES.PLAN_NOT_FOUND);

  // 压港计划先不能审批通过：必须改期并解除压港后再走审批。
  if (plan.status === "CONFLICT") {
    log(LOG_TEMPLATES.BerthPlan.APPROVE_REJECTED, id, "审批被拦截：计划处于压港状态，需先改期", operatorId);
    throw httpError(409, ERROR_CODES.PLAN_IN_CONFLICT, ERROR_MESSAGES.PLAN_IN_CONFLICT);
  }
  if (plan.status !== "DRAFT") {
    throw httpError(409, ERROR_CODES.VALIDATION_FAILED, `plan status ${plan.status} is not approvable`);
  }

  berthPlanRepository.update(id, { status: "APPROVED" });
  log(LOG_TEMPLATES.BerthPlan.APPROVE, id, "审批通过", operatorId);
  return createBerthPlanDto(berthPlanRepository.findById(id) as BerthPlan);
};

export const berthPlanService = { list, conflicts, logs, recalculateConflicts, reschedule, approve };
