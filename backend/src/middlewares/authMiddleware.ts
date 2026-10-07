import type { RequestHandler } from "express";

// 本地开发鉴权桩：解析调用方身份；生产环境由 JWT 承载
export const authMiddleware: RequestHandler = (req, _res, next) => {
  req.user = {
    id: req.header("x-user-id") ?? 1,
    role: req.header("x-role") ?? "admin"
  };
  next();
};
