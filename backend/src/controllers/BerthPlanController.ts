import type { Request, Response, NextFunction } from "express";
import { berthPlanService } from "../services/BerthPlanService";
import { YIELD_RULE_TEXT } from "../utils/yieldRule";
import { httpError, isHttpError } from "../utils/httpError";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const operatorIdOf = (req: Request): number => Number((req as any).user?.id ?? 0);

// controller 层单独包装异常：业务错误透传，未知错误统一折成 500。
const handle = (res: Response, next: NextFunction, fn: () => unknown): void => {
  try {
    res.json(fn());
  } catch (err) {
    if (isHttpError(err)) return next(err);
    next(httpError(500, ERROR_CODES.VALIDATION_FAILED, ERROR_MESSAGES.VALIDATION_FAILED));
  }
};

export const berthPlanController = {
  list: (_req: Request, res: Response) => res.json(berthPlanService.list()),
  conflicts: (_req: Request, res: Response) => res.json({ rule: YIELD_RULE_TEXT, pairs: berthPlanService.conflicts() }),
  logs: (_req: Request, res: Response) => res.json(berthPlanService.logs()),
  recalculate: (req: Request, res: Response, next: NextFunction) =>
    handle(res, next, () => ({ rule: YIELD_RULE_TEXT, pairs: berthPlanService.recalculateConflicts(operatorIdOf(req)) })),
  reschedule: (req: Request, res: Response, next: NextFunction) =>
    handle(res, next, () => berthPlanService.reschedule(Number(req.params.id), req.body, operatorIdOf(req))),
  approve: (req: Request, res: Response, next: NextFunction) =>
    handle(res, next, () => berthPlanService.approve(Number(req.params.id), operatorIdOf(req))),
  create: (req: Request, res: Response) => res.status(201).json(req.body)
};
