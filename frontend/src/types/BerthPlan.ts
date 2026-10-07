export interface BerthPlan {
  id: number;
  vessel_id: number;
  berth_id: number;
  planned_arrival: string;
  planned_departure: string;
  priority: string;
  status: string;
  dispatcher_id: number;
}

// 同一泊位时间区间相撞的对方计划；压港只挂在让步方一条上
export interface BerthPlanConflict {
  plan_id: number;
  other_plan_id: number;
  berth_id: number;
  berth_code: string;
  reason: string;
}

export interface BerthPlanRow extends BerthPlan {
  in_conflict: boolean;
  conflict_with: BerthPlanConflict | null;
}

export interface AuditLog {
  id: number;
  actor: string;
  action: string;
  target_type: string;
  target_id: string;
  detail: string;
  created_at: string;
}
