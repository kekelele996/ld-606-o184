export const LOG_TEMPLATES = {
  Vessel: { CREATE: "船舶创建", UPDATE: "船舶更新", STATUS: "船舶状态变更", EXPORT: "船舶导出" },
  Berth: { CREATE: "泊位创建", UPDATE: "泊位更新", STATUS: "泊位状态变更", EXPORT: "泊位导出" },
  BerthPlan: {
    CREATE: "靠泊计划创建",
    UPDATE: "靠泊计划更新",
    STATUS: "靠泊计划状态变更",
    EXPORT: "靠泊计划导出",
    CONFLICT_RECALCULATE: "压港冲突重算",
    RESCHEDULE: "靠泊计划改期",
    APPROVE: "靠泊计划审批通过",
    APPROVE_REJECTED: "靠泊计划审批被拦截"
  },
  YardSlot: { CREATE: "堆场箱位创建", UPDATE: "堆场箱位更新", STATUS: "堆场箱位状态变更", EXPORT: "堆场箱位导出" },
  WorkTask: { CREATE: "港口作业任务创建", UPDATE: "港口作业任务更新", STATUS: "港口作业任务状态变更", EXPORT: "港口作业任务导出" }
};

// 后端写入操作日志的 action（英文模板）→ 页面展示文案。
export const LOG_ACTION_TEXT: Record<string, string> = {
  "BerthPlan.create": LOG_TEMPLATES.BerthPlan.CREATE,
  "BerthPlan.update": LOG_TEMPLATES.BerthPlan.UPDATE,
  "BerthPlan.status": LOG_TEMPLATES.BerthPlan.STATUS,
  "BerthPlan.export": LOG_TEMPLATES.BerthPlan.EXPORT,
  "BerthPlan.conflict.recalculate": LOG_TEMPLATES.BerthPlan.CONFLICT_RECALCULATE,
  "BerthPlan.reschedule": LOG_TEMPLATES.BerthPlan.RESCHEDULE,
  "BerthPlan.approve": LOG_TEMPLATES.BerthPlan.APPROVE,
  "BerthPlan.approve.rejected": LOG_TEMPLATES.BerthPlan.APPROVE_REJECTED
};
