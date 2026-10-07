import { Component, Input, OnChanges, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import type { BerthPlanRow } from "../../types/BerthPlan";
import type { Berth } from "../../types/Berth";
import { formatShortDate } from "../../utils/formatters";

interface Bar {
  plan: BerthPlanRow;
  left: number;
  width: number;
  vesselName: string;
}

@Component({
  selector: "app-berth-timeline",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline" *ngFor="let track of tracks()">
      <div class="berth">
        <strong>{{ track.berth.berth_code }}</strong>
        <small>{{ track.berth.length_m }}m / {{ track.berth.water_depth_m }}m</small>
      </div>
      <div class="lanes">
        <div class="lane" *ngFor="let lane of track.lanes">
          <div
            class="bar"
            *ngFor="let bar of lane"
            [class.conflict]="bar.plan.in_conflict"
            [class.approved]="bar.plan.status === 'APPROVED'"
            [style.left.%]="bar.left"
            [style.width.%]="bar.width"
            [title]="bar.plan.id + ' ' + bar.vesselName"
          >
            <span class="bar-label">#{{ bar.plan.id }} {{ bar.vesselName }}</span>
          </div>
        </div>
        <div class="axis"><span>{{ axisStart() }}</span><span>{{ axisEnd() }}</span></div>
      </div>
    </div>
    <p class="legend"><i class="sw normal"></i>正常计划　<i class="sw approved"></i>已审批　<i class="sw conflict"></i>压港（仅让步方）</p>
  `,
  styles: [`
    .timeline { display: grid; grid-template-columns: 110px 1fr; gap: 10px; align-items: stretch; margin-bottom: 12px; }
    .berth { background: #274335; color: #f5f1e6; border-radius: 6px; padding: 10px 12px; display: flex; flex-direction: column; justify-content: center; gap: 2px; }
    .berth small { color: #b9c9bb; font-size: 11px; }
    .lanes { position: relative; border: 1px solid #d8d6c8; border-radius: 6px; padding: 8px; background: #fbfaf4; display: flex; flex-direction: column; gap: 6px; }
    .lane { position: relative; height: 30px; }
    .bar { position: absolute; top: 0; height: 28px; min-width: 60px; border-radius: 5px; background: #8fb098; border: 1px solid #5d8068; display: flex; align-items: center; overflow: hidden; }
    .bar.approved { background: #6f93c4; border-color: #3f6294; }
    .bar.conflict { background: #c84a2b; border-color: #93301a; box-shadow: 0 0 0 2px rgba(200, 74, 43, .25); }
    .bar-label { color: #fff; font-size: 11px; font-weight: 700; padding: 0 8px; white-space: nowrap; }
    .axis { display: flex; justify-content: space-between; font-size: 10px; color: #8a8575; border-top: 1px dashed #d8d6c8; padding-top: 4px; }
    .legend { margin: 4px 0 0; font-size: 12px; color: #596257; }
    .sw { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin: 0 4px 0 10px; vertical-align: -1px; }
    .sw.normal { background: #8fb098; } .sw.approved { background: #6f93c4; } .sw.conflict { background: #c84a2b; }
  `]
})
export class BerthTimeline implements OnChanges {
  @Input() berths: Berth[] = [];
  @Input() plans: BerthPlanRow[] = [];
  @Input() vesselNameOf: (id: number) => string = () => "";

  private rangeStart = 0;
  private rangeEnd = 1;
  readonly tracks = signal<{ berth: Berth; lanes: Bar[][] }[]>([]);

  ngOnChanges() {
    const times = this.plans.flatMap((plan) => [new Date(plan.planned_arrival).getTime(), new Date(plan.planned_departure).getTime()]).filter((value) => !Number.isNaN(value));
    this.rangeStart = Math.min(...times);
    this.rangeEnd = Math.max(...times);
    if (this.rangeEnd === this.rangeStart) this.rangeEnd += 1;

    this.tracks.set(this.berths.map((berth) => {
      const onBerth = this.plans.filter((plan) => plan.berth_id === berth.id);
      const lanes: Bar[][] = [];
      [...onBerth]
        .sort((a, b) => new Date(a.planned_arrival).getTime() - new Date(b.planned_arrival).getTime())
        .forEach((plan) => {
          const start = new Date(plan.planned_arrival).getTime();
          const end = new Date(plan.planned_departure).getTime();
          const left = ((start - this.rangeStart) / (this.rangeEnd - this.rangeStart)) * 100;
          const width = Math.max(2, ((end - start) / (this.rangeEnd - this.rangeStart)) * 100);
          const vesselName = this.vesselNameOf(plan.vessel_id);
          const laneIndex = lanes.findIndex((lane) => lane.every((bar) => bar.left + bar.width <= left + 0.5));
          const bar: Bar = { plan, left, width, vesselName };
          if (laneIndex === -1) lanes.push([bar]);
          else lanes[laneIndex].push(bar);
        });
      if (lanes.length === 0) lanes.push([]);
      return { berth, lanes };
    }));
  }

  axisStart() { return formatShortDate(new Date(this.rangeStart).toISOString()); }
  axisEnd() { return formatShortDate(new Date(this.rangeEnd).toISOString()); }
}
