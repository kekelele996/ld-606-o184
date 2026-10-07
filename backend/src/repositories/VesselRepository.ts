import type { Vessel } from "../models/Vessel";

// 本地种子数据（对应 database/init.sql），无第三方数据源
const vessels: Vessel[] = [
  { id: 1, vessel_name: "远洋之星", imo_no: "IMO9472910", carrier: "中远海运", length_m: 220, draft_m: 11.5, eta: "2026-10-10T06:00:00", etd: "2026-10-11T18:00:00", status: "EXPECTED" },
  { id: 2, vessel_name: "东方明珠", imo_no: "IMO9638512", carrier: "东方海外", length_m: 280, draft_m: 13.2, eta: "2026-10-10T08:30:00", etd: "2026-10-11T20:00:00", status: "EXPECTED" },
  { id: 3, vessel_name: "南方快航", imo_no: "IMO9751083", carrier: "达飞轮船", length_m: 190, draft_m: 9.8, eta: "2026-10-10T14:00:00", etd: "2026-10-12T06:00:00", status: "EXPECTED" },
  { id: 4, vessel_name: "海王星", imo_no: "IMO9302178", carrier: "马士基", length_m: 260, draft_m: 12.6, eta: "2026-10-10T20:00:00", etd: "2026-10-12T08:00:00", status: "EXPECTED" },
  { id: 5, vessel_name: "港湾号", imo_no: "IMO9510219", carrier: "招商轮船", length_m: 175, draft_m: 8.4, eta: "2026-10-11T05:00:00", etd: "2026-10-12T12:00:00", status: "EXPECTED" },
  { id: 6, vessel_name: "长风轮", imo_no: "IMO9802514", carrier: "中远海运", length_m: 205, draft_m: 10.1, eta: "2026-10-11T10:00:00", etd: "2026-10-13T02:00:00", status: "EXPECTED" }
];

export const vesselRepository = {
  findAll: (): Vessel[] => vessels,
  findById: (id: number): Vessel | undefined => vessels.find((row) => row.id === id),
  save: (row: unknown): Vessel => {
    const record = row as Vessel;
    vessels.push({ ...record, id: record.id ?? vessels.length + 1 });
    return record;
  }
};
