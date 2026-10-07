import type { AuditLog, BerthPlanRow } from "../types/BerthPlan";
import type { BerthPlanReschedulePayload } from "./types";

const endpoint = "/api/berth-plan";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw Object.assign(new Error(body?.message ?? `请求失败（${res.status}）`), { code: body?.code, status: res.status });
  }
  return body as T;
}

// 计划数据统一从后端取，压港标记以后端重算结果为准
export const listBerthPlan = (): Promise<BerthPlanRow[]> => request<BerthPlanRow[]>(endpoint);

export const createBerthPlan = (payload: {
  vessel_id: number;
  berth_id: number;
  planned_arrival: string;
  planned_departure: string;
  priority: string;
}) => request<BerthPlanRow>(endpoint, { method: "POST", body: JSON.stringify(payload) });

// 改期：后端改完会重新计算一遍压港
export const rescheduleBerthPlan = (id: number, payload: BerthPlanReschedulePayload) =>
  request<BerthPlanRow>(`${endpoint}/${id}/reschedule`, { method: "PATCH", body: JSON.stringify(payload) });

// 审批：压港计划会被后端驳回
export const approveBerthPlan = (id: number) =>
  request<BerthPlanRow>(`${endpoint}/${id}/approve`, { method: "POST" });

export const listBerthPlanLogs = (planId?: number): Promise<AuditLog[]> =>
  request<AuditLog[]>(`${endpoint}/logs${planId ? `?planId=${planId}` : ""}`);
