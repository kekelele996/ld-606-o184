import { DEFAULT_PRIORITY } from "../constants/priority";

export const createBerthPlanDto = (overrides: Record<string, unknown> = {}) => ({
  id: 0,
  vessel_id: 0,
  berth_id: 0,
  planned_arrival: "",
  planned_departure: "",
  priority: DEFAULT_PRIORITY,
  status: "DRAFT",
  dispatcher_id: 0,
  ...overrides
});

export const createBerthPlanRowDto = (overrides: Record<string, unknown> = {}) => ({
  ...createBerthPlanDto(),
  in_conflict: false,
  conflict_with: null,
  ...overrides
});
