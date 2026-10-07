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

## 泊位压港检测与审批联动

泊位计划页（`/berths`）自动检测**同一泊位时间区间相撞**（半开区间 `[靠泊, 离泊)`，首尾相接不算压港）。

- **让步口径（唯一一条挂压港标记）**：相撞的两条计划中，`priority` 等级低的让等级高的（HIGH > NORMAL > LOW）；优先级相同则计划编号大的让编号小的（先编先排）。压港只标在让步方一条上，保留方不标红。
- **审批挂钩**：压港计划（`CONFLICT`）审批接口直接驳回（409 `BERTH_PLAN_CONFLICT_APPROVAL_BLOCKED`）；改期后后端重新计算一遍，解除压港的计划退回 `DRAFT`，再走审批。
- **操作日志**：冲突计算（标记/解除）、改期、审批通过/驳回均写 `audit_log`，可在页面底部或 `GET /api/berth-plan/logs` 查看。
- 前端 `hooks/useBerthConflict.ts` 与后端 `services/BerthPlanConflictService.ts` 使用同一套口径；红色标记与审批拦截以后端返回的 `in_conflict` 为准。

接口：`GET /api/berth-plan`、`POST /api/berth-plan`、`PATCH /api/berth-plan/:id/reschedule`、`POST /api/berth-plan/:id/approve`、`GET /api/berth-plan/logs`。

## 枚举/常量出现位置清单

- BerthPlanStatus: constants/BerthPlanStatus、types/BerthPlanStatus、constructors、logTemplates、errorMessages、errorCodes、hooks/useBerthConflict、components/common（StatusBadge/ConflictBadge/BerthTimeline）、pages/BerthsPage、后端 constants/services/controllers/repositories、database/init.sql 均有引用。
- YardSlotStatus: constants/YardSlotStatus、types/YardSlotStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- WorkTaskType: constants/WorkTaskType、types/WorkTaskType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
