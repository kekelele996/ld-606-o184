import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-status-badge",
  standalone: true,
  imports: [CommonModule],
  template: `<span class="status-badge" [class]="'s-' + tone">{{ text }}</span>`,
  styles: [`
    .status-badge { display: inline-flex; align-items: center; border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 700; }
    .s-gray { background: #eceae1; color: #6b6a5e; }
    .s-red { background: #fbe3de; color: #a13a23; }
    .s-green { background: #e1efe4; color: #1f5e35; }
    .s-blue { background: #e1eaf4; color: #1d4b7a; }
    .s-amber { background: #f6eccf; color: #7d5a12; }
  `]
})
export class StatusBadge {
  @Input() text = "";
  @Input() tone: "gray" | "red" | "green" | "blue" | "amber" = "gray";
}
