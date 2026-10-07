export interface BerthPlan {
  id: number;
  vessel_id: number;
  berth_id: number;
  planned_arrival: string;
  planned_departure: string;
  priority: number;
  status: string;
  dispatcher_id: number;
}

export interface BerthPlanConflictPair {
  berth_id: number;
  keeper_id: number;
  loser_id: number;
  overlap_start: string;
  overlap_end: string;
}
