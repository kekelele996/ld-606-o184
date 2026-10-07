import { Router } from "express";
import { berthPlanController } from "../controllers/BerthPlanController";

const router = Router();
router.get("/", berthPlanController.list);
router.get("/conflicts", berthPlanController.conflicts);
router.get("/logs", berthPlanController.logs);
router.post("/recalculate", berthPlanController.recalculate);
router.post("/:id/reschedule", berthPlanController.reschedule);
router.post("/:id/approve", berthPlanController.approve);
router.post("/", berthPlanController.create);
export default router;
