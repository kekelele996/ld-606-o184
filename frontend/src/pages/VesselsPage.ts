import { Component } from "@angular/core";

@Component({
  selector: "app-vessels-page",
  standalone: true,
  template: `<section class="page-head"><div><p class="eyebrow">VESSEL</p><h1>船舶预报</h1></div></section>
  <div class="panel"><p>船舶登记与 ETA/ETD 维护页面，泊位计划页已可引用船舶数据。</p></div>`
})
export class VesselsPage {}
