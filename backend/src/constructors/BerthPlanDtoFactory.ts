import type { BerthPlan } from "../models/BerthPlan";
import type { OperationLog } from "../models/OperationLog";

export interface BerthPlanConflictPair {
  berth_id: number;
  keeper_id: number;
  loser_id: number;
  overlap_start: string;
  overlap_end: string;
}

export const createBerthPlanDto = (row: BerthPlan): BerthPlan => ({
  id: row.id,
  vessel_id: row.vessel_id,
  berth_id: row.berth_id,
  planned_arrival: row.planned_arrival,
  planned_departure: row.planned_departure,
  priority: row.priority,
  status: row.status,
  dispatcher_id: row.dispatcher_id
});

export const createConflictPairDto = (pair: BerthPlanConflictPair): BerthPlanConflictPair => ({ ...pair });

export const createOperationLogDto = (row: OperationLog): OperationLog => ({ ...row });
