export interface BerthPlanPayload {
  vessel_id?: number;
  berth_id?: number;
  planned_arrival?: string;
  planned_departure?: string;
  priority?: string;
  dispatcher_id?: number;
}

export interface BerthPlanReschedulePayload {
  planned_arrival?: string;
  planned_departure?: string;
}
