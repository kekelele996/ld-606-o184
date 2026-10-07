export const LOG_TEMPLATES = {
  Vessel: { CREATE: "Vessel.create", UPDATE: "Vessel.update", STATUS: "Vessel.status", EXPORT: "Vessel.export" },
  Berth: { CREATE: "Berth.create", UPDATE: "Berth.update", STATUS: "Berth.status", EXPORT: "Berth.export" },
  BerthPlan: {
    CREATE: "BerthPlan.create",
    UPDATE: "BerthPlan.update",
    STATUS: "BerthPlan.status",
    EXPORT: "BerthPlan.export",
    CONFLICT_RECALCULATE: "BerthPlan.conflict.recalculate",
    RESCHEDULE: "BerthPlan.reschedule",
    APPROVE: "BerthPlan.approve",
    APPROVE_REJECTED: "BerthPlan.approve.rejected"
  },
  YardSlot: { CREATE: "YardSlot.create", UPDATE: "YardSlot.update", STATUS: "YardSlot.status", EXPORT: "YardSlot.export" },
  WorkTask: { CREATE: "WorkTask.create", UPDATE: "WorkTask.update", STATUS: "WorkTask.status", EXPORT: "WorkTask.export" }
};
