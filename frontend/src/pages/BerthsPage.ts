import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BerthPlanStore } from "../stores/BerthPlanStore";
import { BerthStore } from "../stores/BerthStore";
import { VesselStore } from "../stores/VesselStore";
import { useBerthConflict } from "../hooks/useBerthConflict";
import { BerthTimeline } from "../components/common/BerthTimeline";
import { StatusBadge } from "../components/common/StatusBadge";
import { ConflictBadge } from "../components/common/ConflictBadge";
import { BerthPlanStatusText } from "../constants/BerthPlanStatus";
import { PRIORITY_OPTIONS, PRIORITY_TEXT } from "../constants/priority";
import { BERTH_PLAN_LOG_ACTION_TEXT } from "../constants/logTemplates";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { fromDateTimeInput, formatDate, toDateTimeInput } from "../utils/formatters";
import type { BerthPlanRow } from "../types/BerthPlan";

const STATUS_TONE: Record<string, "gray" | "red" | "green" | "blue" | "amber"> = {
  DRAFT: "gray",
  CONFLICT: "red",
  APPROVED: "green",
  BERTHING: "blue",
  DEPARTED: "gray",
  CANCELLED: "amber"
};

interface EditState {
  arrival: string;
  departure: string;
}

@Component({
  selector: "app-berths-page",
  standalone: true,
  imports: [CommonModule, FormsModule, BerthTimeline, StatusBadge, ConflictBadge],
  templateUrl: "./berths-page.html",
  styleUrl: "./berths-page.css"
})
export class BerthsPage implements OnInit {
  readonly store = inject(BerthPlanStore);
  readonly berthStore = inject(BerthStore);
  readonly vesselStore = inject(VesselStore);

  readonly statusText = BerthPlanStatusText;
  readonly priorityText = PRIORITY_TEXT;
  readonly priorityOptions = PRIORITY_OPTIONS;
  readonly logActionText = BERTH_PLAN_LOG_ACTION_TEXT;
  readonly formatDate = formatDate;

  editingId = signal<number | null>(null);
  editForm = signal<EditState>({ arrival: "", departure: "" });
  actionError = signal("");
  selectedLogPlanId = signal<number | undefined>(undefined);

  // 压港口径计算（与后端同口径）：页面甘特图与压港说明用，
  // 红色标记/审批拦截以后端返回的 in_conflict 为准
  conflictSummary = computed(() => useBerthConflict(this.store.rows()));
  conflictCount = computed(() => this.store.rows().filter((row) => row.in_conflict).length);

  ngOnInit() {
    this.berthStore.load();
    this.vesselStore.load();
    void this.store.load().then(() => this.store.loadLogs());
  }

  vesselName(id: number): string {
    return this.vesselStore.nameOf(id);
  }

  berthCode(id: number): string {
    return this.berthStore.codeOf(id);
  }

  priorityLabel(value: string): string {
    return PRIORITY_TEXT[value] ?? value;
  }

  statusLabel(value: string): string {
    return BerthPlanStatusText[value as keyof typeof BerthPlanStatusText] ?? value;
  }

  toneOf(value: string): "gray" | "red" | "green" | "blue" | "amber" {
    return STATUS_TONE[value] ?? "gray";
  }

  logActionLabel(action: string): string {
    return BERTH_PLAN_LOG_ACTION_TEXT[action] ?? action;
  }

  reasonOf(row: BerthPlanRow): string {
    return row.conflict_with?.reason ?? "";
  }

  startEdit(row: BerthPlanRow) {
    this.actionError.set("");
    this.editingId.set(row.id);
    this.editForm.set({
      arrival: toDateTimeInput(row.planned_arrival),
      departure: toDateTimeInput(row.planned_departure)
    });
  }

  cancelEdit() {
    this.editingId.set(null);
    this.actionError.set("");
  }

  // 改期提交：后端改完重新计算压港，解除的那条退回草稿再走审批
  async submitReschedule(row: BerthPlanRow) {
    const form = this.editForm();
    if (!form.arrival || !form.departure || new Date(form.departure).getTime() <= new Date(form.arrival).getTime()) {
      this.actionError.set(ERROR_MESSAGES.BERTH_PLAN_INVALID_TIME);
      return;
    }
    try {
      await this.store.reschedule(row.id, {
        planned_arrival: fromDateTimeInput(form.arrival),
        planned_departure: fromDateTimeInput(form.departure)
      });
      this.editingId.set(null);
      this.actionError.set("");
      await this.store.loadLogs();
    } catch (err) {
      this.actionError.set((err as Error).message);
    }
  }

  // 审批：压港计划会被后端驳回
  async approve(row: BerthPlanRow) {
    try {
      await this.store.approve(row.id);
      this.actionError.set("");
      await this.store.loadLogs(row.id);
      this.selectedLogPlanId.set(row.id);
    } catch (err) {
      this.actionError.set((err as Error).message);
    }
  }

  async showLogs(planId?: number) {
    this.selectedLogPlanId.set(planId);
    await this.store.loadLogs(planId);
  }

  isApproving(row: BerthPlanRow): boolean {
    return row.status === "DRAFT";
  }
}
