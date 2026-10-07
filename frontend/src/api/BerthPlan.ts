import { mockData } from "../mocks/seedData";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import type { BerthPlan, BerthPlanConflictPair } from "../types/BerthPlan";
import type { OperationLog } from "../types/OperationLog";

const endpoint = "/api/berth-plan";

export interface BerthPlanConflictResult {
  rule: string;
  pairs: BerthPlanConflictPair[];
}

export interface BerthPlanReschedulePayload {
  planned_arrival: string;
  planned_departure: string;
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json" },
    ...init
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const code = body?.code as keyof typeof ERROR_MESSAGES | undefined;
    const message = (code && ERROR_MESSAGES[code]) || body?.message || ERROR_MESSAGES.VALIDATION_FAILED;
    throw new Error(message);
  }
  return body as T;
}

export async function listBerthPlan(): Promise<BerthPlan[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.berthPlan as unknown as BerthPlan[])];
}

export function listBerthPlanConflicts(): Promise<BerthPlanConflictResult> {
  return request<BerthPlanConflictResult>(`${endpoint}/conflicts`);
}

export function listBerthPlanLogs(): Promise<OperationLog[]> {
  return request<OperationLog[]>(`${endpoint}/logs`);
}

export function recalculateBerthPlan(): Promise<BerthPlanConflictResult> {
  return request<BerthPlanConflictResult>(`${endpoint}/recalculate`, { method: "POST" });
}

export function rescheduleBerthPlan(id: number, payload: BerthPlanReschedulePayload): Promise<{ plan: BerthPlan; pairs: BerthPlanConflictPair[] }> {
  return request(`${endpoint}/${id}/reschedule`, { method: "POST", body: JSON.stringify(payload) });
}

export function approveBerthPlan(id: number): Promise<BerthPlan> {
  return request<BerthPlan>(`${endpoint}/${id}/approve`, { method: "POST" });
}
