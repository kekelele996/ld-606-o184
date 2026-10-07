export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  BERTH_PLAN_NOT_FOUND: "靠泊计划不存在",
  BERTH_PLAN_INVALID_TIME: "离泊时间必须晚于靠泊时间",
  BERTH_PLAN_CONFLICT_APPROVAL_BLOCKED: "该计划处于压港状态，请先改期解除压港后再审批",
  BERTH_PLAN_RESCHEDULE_LOCKED: "计划已靠泊或离泊，不能改期"
};
