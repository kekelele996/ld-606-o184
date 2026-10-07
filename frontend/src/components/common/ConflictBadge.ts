import { Component, Input } from "@angular/core";

// 压港标记：只出现在让步方那一条计划上，避免两条都标红不知道让谁改期。
@Component({
  selector: "conflict-badge",
  standalone: true,
  template: `<span class="conflict-badge" [title]="title">压港 · 让位于 #{{ keeperId }}</span>`
})
export class ConflictBadge {
  @Input() keeperId: number | null = null;
  @Input() overlapStart: string | null = null;
  @Input() overlapEnd: string | null = null;

  get title(): string {
    if (!this.overlapStart || !this.overlapEnd) return "与保留计划时间相撞";
    return `相撞区间 ${this.overlapStart} ~ ${this.overlapEnd}`;
  }
}
