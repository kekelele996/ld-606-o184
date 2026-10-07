import { seed } from "../seed";
import type { BerthPlan } from "../models/BerthPlan";

// 内存数据源：从种子数据深拷贝，运行期的改期/状态变更都落在这里。
const rows: BerthPlan[] = seed.berthPlan.map((row) => ({ ...row }));

export const berthPlanRepository = {
  findAll: (): BerthPlan[] => rows,
  findById: (id: number): BerthPlan | undefined => rows.find((row) => row.id === id),
  save: (row: BerthPlan): BerthPlan => { rows.push(row); return row; },
  update: (id: number, patch: Partial<BerthPlan>): BerthPlan | undefined => {
    const row = rows.find((item) => item.id === id);
    if (!row) return undefined;
    Object.assign(row, patch);
    return row;
  }
};
