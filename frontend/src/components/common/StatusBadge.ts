import { Component, Input } from "@angular/core";
import { BerthPlanStatusText, type BerthPlanStatus } from "../../constants/BerthPlanStatus";

@Component({
  selector: "status-badge",
  standalone: true,
  template: `<span class="status-badge" [attr.data-status]="status">{{ text }}</span>`
})
export class StatusBadge {
  @Input() status: string = "";

  get text(): string {
    return BerthPlanStatusText[this.status as BerthPlanStatus] ?? this.status;
  }
}
