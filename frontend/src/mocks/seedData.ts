// 离线评审兜底数据，接口以 /api 后端返回为准
export const mockData = {
  "vessel": [
    { id: 1, vessel_name: "远洋之星", imo_no: "IMO9472910", carrier: "中远海运", length_m: 220, draft_m: 11.5, eta: "2026-10-10T06:00:00", etd: "2026-10-11T18:00:00", status: "EXPECTED" },
    { id: 2, vessel_name: "东方明珠", imo_no: "IMO9638512", carrier: "东方海外", length_m: 280, draft_m: 13.2, eta: "2026-10-10T08:30:00", etd: "2026-10-11T20:00:00", status: "EXPECTED" },
    { id: 3, vessel_name: "南方快航", imo_no: "IMO9751083", carrier: "达飞轮船", length_m: 190, draft_m: 9.8, eta: "2026-10-10T14:00:00", etd: "2026-10-12T06:00:00", status: "EXPECTED" },
    { id: 4, vessel_name: "海王星", imo_no: "IMO9302178", carrier: "马士基", length_m: 260, draft_m: 12.6, eta: "2026-10-10T20:00:00", etd: "2026-10-12T08:00:00", status: "EXPECTED" },
    { id: 5, vessel_name: "港湾号", imo_no: "IMO9510219", carrier: "招商轮船", length_m: 175, draft_m: 8.4, eta: "2026-10-11T05:00:00", etd: "2026-10-12T12:00:00", status: "EXPECTED" },
    { id: 6, vessel_name: "长风轮", imo_no: "IMO9802514", carrier: "中远海运", length_m: 205, draft_m: 10.1, eta: "2026-10-11T10:00:00", etd: "2026-10-13T02:00:00", status: "EXPECTED" }
  ],
  "berth": [
    { id: 1, berth_code: "A01", length_m: 300, water_depth_m: 15, berth_type: "DEEP", current_status: "OPEN", safety_note: "深水泊位，高潮位靠泊" },
    { id: 2, berth_code: "A02", length_m: 240, water_depth_m: 12, berth_type: "GENERAL", current_status: "OPEN", safety_note: "" },
    { id: 3, berth_code: "B01", length_m: 210, water_depth_m: 10.5, berth_type: "GENERAL", current_status: "MAINTENANCE", safety_note: "10 月例行维护" }
  ],
  "berthPlan": [
    { id: 1, vessel_id: 1, berth_id: 1, planned_arrival: "2026-10-10T08:00:00", planned_departure: "2026-10-10T20:00:00", priority: "HIGH", status: "APPROVED", dispatcher_id: 1, in_conflict: false, conflict_with: null },
    { id: 2, vessel_id: 2, berth_id: 1, planned_arrival: "2026-10-10T14:00:00", planned_departure: "2026-10-11T08:00:00", priority: "NORMAL", status: "CONFLICT", dispatcher_id: 1, in_conflict: true, conflict_with: { plan_id: 2, other_plan_id: 1, berth_id: 1, berth_code: "A01", reason: "与计划#1 在泊位 A01 时间相撞：优先级 NORMAL 低于 HIGH，低级让高级，请改期" } },
    { id: 3, vessel_id: 3, berth_id: 2, planned_arrival: "2026-10-10T10:00:00", planned_departure: "2026-10-11T10:00:00", priority: "HIGH", status: "APPROVED", dispatcher_id: 1, in_conflict: false, conflict_with: null },
    { id: 4, vessel_id: 4, berth_id: 2, planned_arrival: "2026-10-11T06:00:00", planned_departure: "2026-10-11T22:00:00", priority: "HIGH", status: "CONFLICT", dispatcher_id: 1, in_conflict: true, conflict_with: { plan_id: 4, other_plan_id: 3, berth_id: 2, berth_code: "A02", reason: "与计划#3 在泊位 A02 时间相撞：优先级同为 HIGH，编号 #4 大于 #3，编号大者让编号小者，请改期" } },
    { id: 5, vessel_id: 5, berth_id: 2, planned_arrival: "2026-10-11T18:00:00", planned_departure: "2026-10-12T18:00:00", priority: "LOW", status: "CONFLICT", dispatcher_id: 1, in_conflict: true, conflict_with: { plan_id: 5, other_plan_id: 4, berth_id: 2, berth_code: "A02", reason: "与计划#4 在泊位 A02 时间相撞：优先级 LOW 低于 HIGH，低级让高级，请改期" } },
    { id: 6, vessel_id: 6, berth_id: 3, planned_arrival: "2026-10-11T09:00:00", planned_departure: "2026-10-12T09:00:00", priority: "NORMAL", status: "APPROVED", dispatcher_id: 1, in_conflict: false, conflict_with: null }
  ],
  "yardSlot": [
    {
      "id": 1,
      "yard_area": "yard area 1",
      "row_no": "row no 1",
      "bay_no": "bay no 1",
      "tier_no": "tier no 1",
      "container_no": "container no 1",
      "slot_status": "CONFLICT",
      "cargo_type": "CONFLICT"
    },
    {
      "id": 2,
      "yard_area": "yard area 2",
      "row_no": "row no 2",
      "bay_no": "bay no 2",
      "tier_no": "tier no 2",
      "container_no": "container no 2",
      "slot_status": "APPROVED",
      "cargo_type": "APPROVED"
    },
    {
      "id": 3,
      "yard_area": "yard area 3",
      "row_no": "row no 3",
      "bay_no": "bay no 3",
      "tier_no": "tier no 3",
      "container_no": "container no 3",
      "slot_status": "DRAFT",
      "cargo_type": "BERTHING"
    }
  ],
  "workTask": [
    {
      "id": 1,
      "berth_plan_id": 1,
      "yard_slot_id": 1,
      "task_type": "CONFLICT",
      "team_id": 1,
      "status": "CONFLICT",
      "planned_start": "planned start 1",
      "finished_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "berth_plan_id": 2,
      "yard_slot_id": 2,
      "task_type": "APPROVED",
      "team_id": 2,
      "status": "APPROVED",
      "planned_start": "planned start 2",
      "finished_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "berth_plan_id": 3,
      "yard_slot_id": 3,
      "task_type": "BERTHING",
      "team_id": 3,
      "status": "DRAFT",
      "planned_start": "planned start 3",
      "finished_at": "2026-06-13T09:00:00Z"
    }
  ]
} as const;
