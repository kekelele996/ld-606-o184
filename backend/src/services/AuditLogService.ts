import { BERTH_PLAN_LOG_TEMPLATES, type BerthPlanLogAction } from "../constants/logTemplates";
import { auditLogRepository } from "../repositories/AuditLogRepository";

export interface AuditActor {
  id: number | string;
  role: string;
}

export interface AuditEntryInput {
  actor: AuditActor;
  action: BerthPlanLogAction;
  targetId: number | string;
  params?: Record<string, string | number>;
}

const render = (template: string, params: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_match, key: string) => String(params[key] ?? ""));

export const auditLogService = {
  record({ actor, action, targetId, params = {} }: AuditEntryInput) {
    const detail = render(BERTH_PLAN_LOG_TEMPLATES[action], params);
    return auditLogRepository.append({
      actor: `${actor.role}#${actor.id}`,
      action,
      target_type: "BerthPlan",
      target_id: String(targetId),
      detail
    });
  },
  list(targetId?: string) {
    return auditLogRepository.findAll("BerthPlan", targetId);
  }
};
