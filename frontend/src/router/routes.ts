import { Routes } from "@angular/router";
import { BerthsPage } from "../pages/BerthsPage";
import { DashboardPage } from "../pages/DashboardPage";
import { VesselsPage } from "../pages/VesselsPage";
import { YardPage } from "../pages/YardPage";
import { TasksPage } from "../pages/TasksPage";

export const routes: Routes = [
  { path: "", redirectTo: "berths", pathMatch: "full" },
  { path: "dashboard", component: DashboardPage },
  { path: "vessels", component: VesselsPage },
  { path: "berths", component: BerthsPage },
  { path: "yard", component: YardPage },
  { path: "tasks", component: TasksPage },
  { path: "**", redirectTo: "berths" }
];

export const navItems = [
  { name: "港口运行总览", route: "/dashboard" },
  { name: "船舶预报", route: "/vessels" },
  { name: "泊位计划", route: "/berths" },
  { name: "堆场箱位", route: "/yard" },
  { name: "作业派工", route: "/tasks" }
] as const;
