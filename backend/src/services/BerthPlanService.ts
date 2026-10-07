import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { DEFAULT_PRIORITY } from "../constants/priority";
import type { BerthPlanPayload, BerthPlanReschedulePayload } from "../types/BerthPlanPayload";
import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import { berthRepository } from "../repositories/BerthRepository";
import { AppError } from "../utils/AppError";
import { auditLogService, type AuditActor } from "./AuditLogService";
import { berthPlanConflictService } from "./BerthPlanConflictService";

const RESCHEDULE_LOCKED_STATUSES = new Set(["BERTHING", "DEPARTED", "CANCELLED"]);
const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;

const requirePlan = (id: number) => {
  const plan = berthPlanRepository.findById(id);
  if (!plan) {
    throw new AppError(404, ERROR_CODES.BERTH_PLAN_NOT_FOUND, ERROR_MESSAGES.BERTH_PLAN_NOT_FOUND);
  }
  return plan;
};

const validateRange = (arrival: string, departure: string) => {
  if (!ISO_PATTERN.test(arrival) || !ISO_PATTERN.test(departure) || new Date(departure).getTime() <= new Date(arrival).getTime()) {
    throw new AppError(400, ERROR_CODES.BERTH_PLAN_INVALID_TIME, ERROR_MESSAGES.BERTH_PLAN_INVALID_TIME);
  }
};

export const berthPlanService = {
  list: () => berthPlanConflictService.buildRows(),

  create(payload: BerthPlanPayload, actor: AuditActor) {
    const plannedArrival = String(payload.planned_arrival ?? "");
    const plannedDeparture = String(payload.planned_departure ?? "");
    validateRange(plannedArrival, plannedDeparture);

    const created = berthPlanRepository.insert({
      vessel_id: Number(payload.vessel_id),
      berth_id: Number(payload.berth_id),
      planned_arrival: plannedArrival,
      planned_departure: plannedDeparture,
      priority: String(payload.priority ?? DEFAULT_PRIORITY),
      status: "DRAFT",
      dispatcher_id: Number(payload.dispatcher_id ?? actor.id)
    });

    auditLogService.record({
      actor,
      action: "BerthPlanCreate",
      targetId: created.id,
      params: {
        planId: created.id,
        berthCode: berthRepository.codeOf(created.berth_id),
        plannedArrival,
        plannedDeparture,
        priority: created.priority
      }
    });

    // 新编排立即参与压港计算，命中让行口径则压港落到本条
    berthPlanConflictService.recompute(actor);
    return berthPlanConflictService.buildRows().find((row) => row.id === created.id);
  },

  // 改期：改完重新计算一遍，解除压港的那条退回草稿
  reschedule(id: number, payload: BerthPlanReschedulePayload, actor: AuditActor) {
    const plan = requirePlan(id);
    if (RESCHEDULE_LOCKED_STATUSES.has(plan.status)) {
      throw new AppError(409, ERROR_CODES.BERTH_PLAN_RESCHEDULE_LOCKED, ERROR_MESSAGES.BERTH_PLAN_RESCHEDULE_LOCKED);
    }

    const previousArrival = plan.planned_arrival;
    const previousDeparture = plan.planned_departure;
    const plannedArrival = String(payload.planned_arrival ?? previousArrival);
    const plannedDeparture = String(payload.planned_departure ?? previousDeparture);
    validateRange(plannedArrival, plannedDeparture);

    berthPlanRepository.update(id, {
      planned_arrival: plannedArrival,
      planned_departure: plannedDeparture
    });

    auditLogService.record({
      actor,
      action: "BerthPlanReschedule",
      targetId: id,
      params: {
        planId: id,
        oldArrival: previousArrival,
        oldDeparture: previousDeparture,
        plannedArrival,
        plannedDeparture
      }
    });

    berthPlanConflictService.recompute(actor);
    return berthPlanConflictService.buildRows().find((row) => row.id === id);
  },

  // 审批：压港计划先不能审批通过（按最新压港计算结果判定，不只是存量状态）
  approve(id: number, actor: AuditActor) {
    const plan = requirePlan(id);
    const row = berthPlanConflictService.buildRows().find((item) => item.id === id);
    if (row?.in_conflict || plan.status === "CONFLICT") {
      auditLogService.record({
        actor,
        action: "BerthPlanApprovalBlocked",
        targetId: id,
        params: { planId: id }
      });
      throw new AppError(409, ERROR_CODES.BERTH_PLAN_CONFLICT_APPROVAL_BLOCKED, ERROR_MESSAGES.BERTH_PLAN_CONFLICT_APPROVAL_BLOCKED);
    }
    if (plan.status !== "DRAFT") {
      throw new AppError(400, ERROR_CODES.VALIDATION_FAILED, ERROR_MESSAGES.VALIDATION_FAILED);
    }

    berthPlanRepository.update(id, { status: "APPROVED" });
    auditLogService.record({
      actor,
      action: "BerthPlanApproved",
      targetId: id,
      params: {
        planId: id,
        berthCode: berthRepository.codeOf(plan.berth_id),
        plannedArrival: plan.planned_arrival,
        plannedDeparture: plan.planned_departure
      }
    });
    return berthPlanConflictService.buildRows().find((row) => row.id === id);
  },

  logs: (targetId?: string) => auditLogService.list(targetId)
};
