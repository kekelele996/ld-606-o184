export const BerthPlanStatus = ["DRAFT", "CONFLICT", "APPROVED", "BERTHING", "DEPARTED", "CANCELLED"] as const;
export type BerthPlanStatus = (typeof BerthPlanStatus)[number];

// 与 constants/BerthPlanStatus.ts 同步的状态文案镜像
export const BerthPlanStatusText: Record<BerthPlanStatus, string> = {
  DRAFT: "草稿",
  CONFLICT: "压港",
  APPROVED: "已审批",
  BERTHING: "靠泊中",
  DEPARTED: "已离泊",
  CANCELLED: "已取消"
};
