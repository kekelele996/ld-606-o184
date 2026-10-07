# 港口泊位与堆场协同系统

面向中小港口的船舶靠泊计划、泊位资源、堆场箱位和作业任务协同平台。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20106>

后端健康检查：<http://localhost:21106/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Angular 17 + TypeScript + RxJS + NG-ZORRO + ECharts |
| 后端 | NestJS + TypeScript + TypeORM |
| 数据库 | MySQL 8.0 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `port-yard`
- `FRONTEND_PORT`: 前端端口，默认 `20106`
- `BACKEND_PORT`: 后端端口，默认 `21106`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: port-yard`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-port-yard}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 泊位压港冲突规则

泊位计划页会自动重算同一泊位内时间区间相撞的计划，并把压港（`CONFLICT`）只标记在让步方一条上，避免两条都标红不知道让谁改期。

- 让步口径：优先级数值高者保留；优先级相同，计划编号小者（先编排的）保留。
- 时间区间按 `[arrival, departure)` 半开区间判定，首尾相接不算相撞；`CANCELLED` / `DEPARTED` 不参与。
- 压港计划不能审批通过（`POST /api/berth-plan/:id/approve` 返回 `409 PLAN_IN_CONFLICT`），必须先改期。
- 改期（`POST /api/berth-plan/:id/reschedule`）后自动重算，解除压港的计划恢复 `DRAFT` 并重新走审批。
- 冲突重算、改期、审批（含被拦截）均写入操作日志，页面可查看（`GET /api/berth-plan/logs`）。
- 手动重算：`POST /api/berth-plan/recalculate`；冲突对明细：`GET /api/berth-plan/conflicts`。

## 枚举/常量出现位置清单

- BerthPlanStatus: constants/BerthPlanStatus、types/BerthPlanStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- YardSlotStatus: constants/YardSlotStatus、types/YardSlotStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- WorkTaskType: constants/WorkTaskType、types/WorkTaskType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
