import { Router } from "express";
import { berthPlanController } from "../controllers/BerthPlanController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();

// 冲突计算/改期/审批均为写操作，限定调度角色，写动作在 service 落审计日志
router.get("/", rbacMiddleware(["dispatcher", "admin"]), berthPlanController.list);
router.post("/", rbacMiddleware(["dispatcher", "admin"]), berthPlanController.create);
router.patch("/:id/reschedule", rbacMiddleware(["dispatcher", "admin"]), berthPlanController.reschedule);
router.post("/:id/approve", rbacMiddleware(["dispatcher", "admin"]), berthPlanController.approve);
router.get("/logs", rbacMiddleware(["dispatcher", "admin"]), berthPlanController.logs);

export default router;
