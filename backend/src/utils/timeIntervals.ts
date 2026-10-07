// 时间区间工具：泊位计划只关心 [arrival, departure) 半开区间。
// 首尾相接（一条离港时间等于另一条到港时间）不算相撞。

export const rangesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean => {
  const a1 = Date.parse(aStart);
  const a2 = Date.parse(aEnd);
  const b1 = Date.parse(bStart);
  const b2 = Date.parse(bEnd);
  if (Number.isNaN(a1) || Number.isNaN(a2) || Number.isNaN(b1) || Number.isNaN(b2)) return false;
  return a1 < b2 && b1 < a2;
};

export const overlapWindow = (aStart: string, aEnd: string, bStart: string, bEnd: string): { start: string; end: string } => {
  const start = new Date(Math.max(Date.parse(aStart), Date.parse(bStart)));
  const end = new Date(Math.min(Date.parse(aEnd), Date.parse(bEnd)));
  return { start: start.toISOString(), end: end.toISOString() };
};
