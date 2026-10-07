import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import {
  listBerthPlan,
  listBerthPlanConflicts,
  listBerthPlanLogs,
  recalculateBerthPlan,
  rescheduleBerthPlan,
  approveBerthPlan,
  type BerthPlanReschedulePayload
} from "../api/BerthPlan";
import type { BerthPlan, BerthPlanConflictPair } from "../types/BerthPlan";
import type { OperationLog } from "../types/OperationLog";

@Injectable({ providedIn: "root" })
export class BerthPlanStore {
  private readonly plansSubject = new BehaviorSubject<BerthPlan[]>([]);
  private readonly pairsSubject = new BehaviorSubject<BerthPlanConflictPair[]>([]);
  private readonly logsSubject = new BehaviorSubject<OperationLog[]>([]);
  private readonly ruleSubject = new BehaviorSubject<string>("");

  readonly plans$ = this.plansSubject.asObservable();
  readonly pairs$ = this.pairsSubject.asObservable();
  readonly logs$ = this.logsSubject.asObservable();
  readonly rule$ = this.ruleSubject.asObservable();

  async loadAll(): Promise<void> {
    const plans = await listBerthPlan();
    this.plansSubject.next(plans);
    try {
      const [conflicts, logs] = await Promise.all([listBerthPlanConflicts(), listBerthPlanLogs()]);
      this.pairsSubject.next(conflicts.pairs);
      this.ruleSubject.next(conflicts.rule);
      this.logsSubject.next(logs);
    } catch {
      // 离线评审时后端不可达：冲突对与日志留空，列表用本地种子兜底。
    }
  }

  async recalculate(): Promise<void> {
    await recalculateBerthPlan();
    await this.loadAll();
  }

  async reschedule(id: number, payload: BerthPlanReschedulePayload): Promise<void> {
    await rescheduleBerthPlan(id, payload);
    await this.loadAll();
  }

  async approve(id: number): Promise<void> {
    await approveBerthPlan(id);
    await this.loadAll();
  }
}
