import { Injectable, signal } from "@angular/core";
import type { AuditLog, BerthPlanRow } from "../types/BerthPlan";
import {
  approveBerthPlan,
  createBerthPlan,
  listBerthPlan,
  listBerthPlanLogs,
  rescheduleBerthPlan
} from "../api/BerthPlan";

@Injectable({ providedIn: "root" })
export class BerthPlanStore {
  rows = signal<BerthPlanRow[]>([]);
  logs = signal<AuditLog[]>([]);
  loading = signal(false);
  error = signal("");

  // 计划数据从后端取，压港标记以后端按统一口径重算的结果为准
  async load() {
    this.loading.set(true);
    this.error.set("");
    try {
      this.rows.set(await listBerthPlan());
    } catch (err) {
      this.error.set((err as Error).message);
    } finally {
      this.loading.set(false);
    }
  }

  async loadLogs(planId?: number) {
    try {
      this.logs.set(await listBerthPlanLogs(planId));
    } catch (err) {
      this.error.set((err as Error).message);
    }
  }

  async create(payload: { vessel_id: number; berth_id: number; planned_arrival: string; planned_departure: string; priority: string }) {
    await createBerthPlan(payload);
    await this.load();
  }

  // 改期：后端会重新计算压港，解除压港的退回草稿
  async reschedule(id: number, payload: { planned_arrival: string; planned_departure: string }) {
    await rescheduleBerthPlan(id, payload);
    await this.load();
  }

  // 审批：压港计划后端直接驳回
  async approve(id: number) {
    await approveBerthPlan(id);
    await this.load();
  }
}
