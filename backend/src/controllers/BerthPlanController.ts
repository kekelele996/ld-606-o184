import type { Request, Response, NextFunction } from "express";
import { berthPlanService } from "../services/BerthPlanService";
import { ERROR_CODES } from "../constants/errorCodes";
import { AppError } from "../utils/AppError";

const parseId = (req: Request) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    throw new AppError(400, ERROR_CODES.VALIDATION_FAILED, "invalid plan id");
  }
  return id;
};

// controller 层再包一层异常，错误不集中吞在全局中间件
const wrap = (handler: (req: Request, res: Response) => unknown) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      handler(req, res);
    } catch (error) {
      next(error instanceof AppError ? error : new AppError(500, "BERTH_PLAN_CONTROLLER_ERROR", String((error as Error).message)));
    }
  };

export const berthPlanController = {
  list: wrap((_req, res) => res.json(berthPlanService.list())),
  create: wrap((req, res) => res.status(201).json(berthPlanService.create(req.body ?? {}, req.user))),
  reschedule: wrap((req, res) => res.json(berthPlanService.reschedule(parseId(req), req.body ?? {}, req.user))),
  approve: wrap((req, res) => res.json(berthPlanService.approve(parseId(req), req.user))),
  logs: wrap((req, res) => res.json(berthPlanService.logs(req.query.planId ? String(req.query.planId) : undefined)))
};
