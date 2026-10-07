export const LOG_TEMPLATES = {
  Vessel: ["Vessel.create", "Vessel.update", "Vessel.status", "Vessel.export"],
  Berth: ["Berth.create", "Berth.update", "Berth.status", "Berth.export"],
  BerthPlan: ["BerthPlan.create", "BerthPlan.update", "BerthPlan.status", "BerthPlan.export"],
  YardSlot: ["YardSlot.create", "YardSlot.update", "YardSlot.status", "YardSlot.export"],
  WorkTask: ["WorkTask.create", "WorkTask.update", "WorkTask.status", "WorkTask.export"]
};

// 泊位计划：编排 / 压港计算 / 改期 / 审批，写操作均落操作日志
export const BERTH_PLAN_LOG_TEMPLATES = {
  BerthPlanCreate: "计划#{planId} 编排：泊位 {berthCode}，{plannedArrival} ~ {plannedDeparture}，优先级 {priority}",
  BerthPlanConflictDetected: "压港计算：计划#{planId} 与计划#{otherPlanId} 在泊位 {berthCode} 时间相撞，按口径“{yieldRule}”由 #{planId} 让行，标记压港",
  BerthPlanConflictCleared: "压港计算：计划#{planId} 改期后已无相撞，解除压港，退回草稿待审批",
  BerthPlanReschedule: "计划#{planId} 改期：{oldArrival} ~ {oldDeparture} 调整为 {plannedArrival} ~ {plannedDeparture}，已重新计算压港",
  BerthPlanApproved: "计划#{planId} 审批通过：泊位 {berthCode}，{plannedArrival} ~ {plannedDeparture}",
  BerthPlanApprovalBlocked: "计划#{planId} 审批驳回：仍处于压港状态，请先改期解除压港"
} as const;

export type BerthPlanLogAction = keyof typeof BERTH_PLAN_LOG_TEMPLATES;
