export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "missing bearer token",
  RBAC_DENIED: "role denied",
  VALIDATION_FAILED: "invalid payload",
  RATE_LIMITED: "too many requests",
  BERTH_PLAN_NOT_FOUND: "berth plan not found",
  BERTH_PLAN_INVALID_TIME: "planned departure must be later than planned arrival",
  BERTH_PLAN_CONFLICT_APPROVAL_BLOCKED: "berth plan is in conflict, reschedule before approval",
  BERTH_PLAN_RESCHEDULE_LOCKED: "berth plan already berthing or departed, cannot reschedule"
};
