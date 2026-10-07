export const seed = {
  "vessel": [
    {
      "id": 1,
      "vessel_name": "海星轮",
      "imo_no": "IMO9300001",
      "carrier": "远洋海运",
      "length_m": "210",
      "draft_m": "11.5",
      "eta": "2026-10-08T08:00:00+08:00",
      "etd": "2026-10-09T18:00:00+08:00",
      "status": "SCHEDULED"
    },
    {
      "id": 2,
      "vessel_name": "蓝鲸轮",
      "imo_no": "IMO9300002",
      "carrier": "环洋航运",
      "length_m": "185",
      "draft_m": "10.2",
      "eta": "2026-10-08T20:00:00+08:00",
      "etd": "2026-10-10T06:00:00+08:00",
      "status": "SCHEDULED"
    },
    {
      "id": 3,
      "vessel_name": "远帆轮",
      "imo_no": "IMO9300003",
      "carrier": "远洋海运",
      "length_m": "168",
      "draft_m": "9.6",
      "eta": "2026-10-08T09:00:00+08:00",
      "etd": "2026-10-09T09:00:00+08:00",
      "status": "INBOUND"
    },
    {
      "id": 4,
      "vessel_name": "晨光轮",
      "imo_no": "IMO9300004",
      "carrier": "南港物流",
      "length_m": "142",
      "draft_m": "8.4",
      "eta": "2026-10-12T08:00:00+08:00",
      "etd": "2026-10-13T08:00:00+08:00",
      "status": "SCHEDULED"
    }
  ],
  "berth": [
    {
      "id": 1,
      "berth_code": "B1",
      "length_m": "220",
      "water_depth_m": "13.5",
      "berth_type": "CONTAINER",
      "current_status": "FREE",
      "safety_note": "大潮期间注意潮汐窗口"
    },
    {
      "id": 2,
      "berth_code": "B2",
      "length_m": "200",
      "water_depth_m": "12.0",
      "berth_type": "GENERAL",
      "current_status": "FREE",
      "safety_note": "定期疏浚，注意水深公告"
    },
    {
      "id": 3,
      "berth_code": "B3",
      "length_m": "180",
      "water_depth_m": "11.0",
      "berth_type": "BULK",
      "current_status": "MAINTENANCE",
      "safety_note": "岸桥检修中，暂停排泊"
    }
  ],
  "berthPlan": [
    {
      "id": 1,
      "vessel_id": 1,
      "berth_id": 1,
      "planned_arrival": "2026-10-08T08:00:00+08:00",
      "planned_departure": "2026-10-09T18:00:00+08:00",
      "priority": 5,
      "status": "DRAFT",
      "dispatcher_id": 1
    },
    {
      "id": 2,
      "vessel_id": 2,
      "berth_id": 1,
      "planned_arrival": "2026-10-08T20:00:00+08:00",
      "planned_departure": "2026-10-10T06:00:00+08:00",
      "priority": 3,
      "status": "DRAFT",
      "dispatcher_id": 1
    },
    {
      "id": 3,
      "vessel_id": 3,
      "berth_id": 2,
      "planned_arrival": "2026-10-08T09:00:00+08:00",
      "planned_departure": "2026-10-09T09:00:00+08:00",
      "priority": 4,
      "status": "APPROVED",
      "dispatcher_id": 2
    },
    {
      "id": 4,
      "vessel_id": 4,
      "berth_id": 1,
      "planned_arrival": "2026-10-12T08:00:00+08:00",
      "planned_departure": "2026-10-13T08:00:00+08:00",
      "priority": 4,
      "status": "DRAFT",
      "dispatcher_id": 2
    }
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
