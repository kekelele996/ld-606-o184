import type { RequestHandler } from "express";

// HTTP 访问留痕；业务操作日志（编排/冲突计算/改期/审批）由 service 层
// 经 auditLogService 持久化到 audit_log，见 BerthPlanService
export const auditLogMiddleware: RequestHandler = (req, _res, next) => {
  if (["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    console.info("audit", req.user?.role ?? "anonymous", req.method, req.path);
  }
  next();
};
