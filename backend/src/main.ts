import express from "express";
import cors from "cors";
import { config } from "./config/env";
import { authMiddleware } from "./middlewares/authMiddleware";
import { auditLogMiddleware } from "./middlewares/auditLogMiddleware";
import { requestLoggerMiddleware } from "./middlewares/requestLoggerMiddleware";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import vesselRoutes from "./routes/VesselRoutes";
import berthRoutes from "./routes/BerthRoutes";
import berthPlanRoutes from "./routes/BerthPlanRoutes";
import yardSlotRoutes from "./routes/YardSlotRoutes";
import workTaskRoutes from "./routes/WorkTaskRoutes";
import { berthPlanConflictService } from "./services/BerthPlanConflictService";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLoggerMiddleware);
app.use(authMiddleware);
app.use(auditLogMiddleware);
app.get("/health", (_req, res) => res.json({ status: "ok", service: "port-yard" }));
app.use("/api/vessel", vesselRoutes);
app.use("/api/berth", berthRoutes);
app.use("/api/berth-plan", berthPlanRoutes);
app.use("/api/yard-slot", yardSlotRoutes);
app.use("/api/work-task", workTaskRoutes);
app.use(errorHandlerMiddleware);

// 启动先跑一遍压港计算，种子计划的压港标记由统一口径得出
berthPlanConflictService.recompute();

app.listen(config.port, () => console.log("port-yard backend listening on", config.port));
