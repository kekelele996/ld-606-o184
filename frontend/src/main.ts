import { Component } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet, provideRouter } from "@angular/router";
import { routes, navItems } from "./router/routes";
import "./styles.css";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
  <div class="shell">
    <aside>
      <div class="brand">港口泊位与堆场协同系统</div>
      <nav>
        <a *ngFor="let item of navItems"
           [routerLink]="item.route"
           routerLinkActive="active"
           [routerLinkActiveOptions]="{ exact: false }">{{ item.name }}</a>
      </nav>
    </aside>
    <main class="page">
      <router-outlet />
    </main>
  </div>`
})
class AppComponent {
  navItems = navItems;
}

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
});
