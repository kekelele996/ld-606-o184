import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

// 压港只挂在让步方一条上；未让行的计划不渲染任何冲突标
@Component({
  selector: "app-conflict-badge",
  standalone: true,
  imports: [CommonModule],
  template: `<span *ngIf="inConflict" class="conflict-badge" [title]="reason">压港 · 让 #{{ otherPlanId }}</span>`,
  styles: [`
    .conflict-badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 800; background: #c84a2b; color: #fff; cursor: help; }
  `]
})
export class ConflictBadge {
  @Input() inConflict = false;
  @Input() otherPlanId: number | null = null;
  @Input() reason = "";
}
