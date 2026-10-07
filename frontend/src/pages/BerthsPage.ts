import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BerthPlanStore } from "../stores/BerthPlanStore";
import { listVessel } from "../api/Vessel";
import { listBerth } from "../api/Berth";
import { useBerthConflict, type BerthConflictView } from "../hooks/useBerthConflict";
import { createBerthPlanRescheduleForm, type BerthPlanRescheduleForm } from "../constructors/BerthPlanConstructor";
import { StatusBadge } from "../components/common/StatusBadge";
import { ConflictBadge } from "../components/common/ConflictBadge";
import { LOG_ACTION_TEXT } from "../constants/logTemplates";
import { formatDate } from "../utils/formatters";
import type { BerthPlan, BerthPlanConflictPair } from "../types/BerthPlan";
import type { OperationLog } from "../types/OperationLog";
import type { Vessel } from "../types/Vessel";
import type { Berth } from "../types/Berth";

@Component({
  selector: "berths-page",
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadge, ConflictBadge],
  template: `
  <section class="panel wide berth-plan-panel">
    <div class="panel-head">
      <div>
        <h2>靠泊计划</h2>
        <p class="rule-text">让步口径：{{ rule || "同一泊位时间相撞时，优先级数值高者保留；优先级相同，计划编号小者保留；压港只标在让步方" }}</p>
      </div>
      <button class="action-btn" type="button" (click)="onRecalculate()" [disabled]="busy">重新计算压港</button>
    </div>

    <p class="error-text" *ngIf="errorMessage">{{ errorMessage }}</p>

    <table class="plan-table">
      <thead>
        <tr>
          <th>编号</th><th>船舶</th><th>泊位</th><th>计划到港</th><th>计划离港</th>
          <th>优先级</th><th>状态</th><th>压港</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <ng-container *ngFor="let plan of plans">
          <tr [class.row-conflict]="isLoser(plan.id)">
            <td>#{{ plan.id }}</td>
            <td>{{ vesselName(plan.vessel_id) }}</td>
            <td>{{ berthCode(plan.berth_id) }}</td>
            <td>{{ formatDate(plan.planned_arrival) }}</td>
            <td>{{ formatDate(plan.planned_departure) }}</td>
            <td>{{ plan.priority }}</td>
            <td><status-badge [status]="plan.status"></status-badge></td>
            <td>
              <conflict-badge
                *ngIf="conflictOf(plan.id)?.loser"
                [keeperId]="conflictOf(plan.id)?.keeperId ?? null"
                [overlapStart]="conflictOf(plan.id)?.overlapStart ?? null"
                [overlapEnd]="conflictOf(plan.id)?.overlapEnd ?? null">
              </conflict-badge>
              <span class="keeper-tag" *ngIf="isKeeper(plan.id)">保留</span>
              <span class="quiet" *ngIf="!conflictOf(plan.id)">—</span>
            </td>
            <td class="ops">
              <button type="button" class="link-btn" (click)="startEdit(plan)" [disabled]="busy">改期</button>
              <button
                type="button"
                class="link-btn approve"
                (click)="onApprove(plan)"
                [disabled]="busy || plan.status !== 'DRAFT'"
                [title]="plan.status === 'CONFLICT' ? '压港计划不能审批通过，请先改期' : ''">审批</button>
            </td>
          </tr>
          <tr class="edit-row" *ngIf="editingId === plan.id">
            <td colspan="9">
              <form class="reschedule-form" (ngSubmit)="onReschedule(plan)">
                <label>新到港
                  <input type="datetime-local" name="arrival" [(ngModel)]="editForm.planned_arrival" required>
                </label>
                <label>新离港
                  <input type="datetime-local" name="departure" [(ngModel)]="editForm.planned_departure" required>
                </label>
                <button class="action-btn" type="submit" [disabled]="busy">保存并重算</button>
                <button class="link-btn" type="button" (click)="editingId = null" [disabled]="busy">取消</button>
              </form>
            </td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  </section>

  <section class="panel">
    <h2>操作日志</h2>
    <article class="row log-row" *ngFor="let entry of logs">
      <strong>{{ actionText(entry.action) }}</strong>
      <span>{{ entry.entity_id ? "计划 #" + entry.entity_id + " · " : "" }}{{ entry.detail }}</span>
      <span class="badge">{{ formatDate(entry.created_at) }}</span>
    </article>
    <p class="quiet" *ngIf="!logs.length">暂无操作日志</p>
  </section>
  `
})
export class BerthsPage implements OnInit {
  plans: BerthPlan[] = [];
  pairs: BerthPlanConflictPair[] = [];
  logs: OperationLog[] = [];
  rule = "";
  vessels = new Map<number, Vessel>();
  berths = new Map<number, Berth>();
  editingId: number | null = null;
  editForm: BerthPlanRescheduleForm = { planned_arrival: "", planned_departure: "" };
  busy = false;
  errorMessage = "";

  readonly formatDate = formatDate;

  constructor(private readonly store: BerthPlanStore) {}

  async ngOnInit(): Promise<void> {
    this.store.plans$.subscribe((rows) => (this.plans = rows));
    this.store.pairs$.subscribe((pairs) => (this.pairs = pairs));
    this.store.logs$.subscribe((logs) => (this.logs = logs));
    this.store.rule$.subscribe((rule) => (this.rule = rule));
    const [vessels, berths] = await Promise.all([listVessel(), listBerth()]);
    this.vessels = new Map(vessels.map((row) => [row.id, row]));
    this.berths = new Map(berths.map((row) => [row.id, row]));
    await this.store.loadAll();
  }

  get conflictView(): Map<number, BerthConflictView> {
    return useBerthConflict(this.plans, this.pairs).view;
  }

  conflictOf(planId: number): BerthConflictView | undefined {
    return this.conflictView.get(planId);
  }

  isLoser(planId: number): boolean {
    return this.conflictOf(planId)?.loser === true;
  }

  isKeeper(planId: number): boolean {
    const view = this.conflictOf(planId);
    return !!view && !view.loser;
  }

  vesselName(id: number): string {
    return this.vessels.get(id)?.vessel_name ?? `#${id}`;
  }

  berthCode(id: number): string {
    return this.berths.get(id)?.berth_code ?? `#${id}`;
  }

  actionText(action: string): string {
    return LOG_ACTION_TEXT[action] ?? action;
  }

  startEdit(plan: BerthPlan): void {
    this.editingId = plan.id;
    this.editForm = createBerthPlanRescheduleForm(plan);
    this.errorMessage = "";
  }

  async onRecalculate(): Promise<void> {
    await this.run(() => this.store.recalculate());
  }

  async onReschedule(plan: BerthPlan): Promise<void> {
    await this.run(async () => {
      await this.store.reschedule(plan.id, {
        planned_arrival: new Date(this.editForm.planned_arrival).toISOString(),
        planned_departure: new Date(this.editForm.planned_departure).toISOString()
      });
      this.editingId = null;
    });
  }

  async onApprove(plan: BerthPlan): Promise<void> {
    await this.run(() => this.store.approve(plan.id));
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.busy = true;
    this.errorMessage = "";
    try {
      await action();
    } catch (err) {
      this.errorMessage = err instanceof Error ? err.message : String(err);
    } finally {
      this.busy = false;
    }
  }
}
