import { Component } from "@angular/core";

@Component({
  selector: "app-dashboard-page",
  standalone: true,
  template: `<section class="page-head"><div><p class="eyebrow">DASHBOARD</p><h1>港口运行总览</h1></div></section>
  <div class="panel"><p>泊位计划页的压港检测、改期与审批已接入后端，总览指标待接入。</p></div>`
})
export class DashboardPage {}
