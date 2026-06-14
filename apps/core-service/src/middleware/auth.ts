import { Request, Response, NextFunction } from "express";
import { UsersDAO } from "../db/users.js";
import { verifyAccessToken } from "../utils/auth-utils.js";
import { canUseSystem } from "../utils/user-access.js";

const AUTH_SECRET = process.env.AUTH_SECRET || "dev-secret";
const usersDao = new UsersDAO();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "OPTIONS") return next();

  const path = req.path || "";

  if (path === "/openapi" || path === "/healthcheck" || path.startsWith("/v1/auth")) {
    return next();
  }

  const authHeader = (req.headers.authorization || req.headers.Authorization) as
    | string
    | undefined;
  if (!authHeader || typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.slice("Bearer ".length);
  const payload = verifyAccessToken(token, AUTH_SECRET);
  if (!payload) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const userId = payload.sub as number;
  const user = await usersDao.findById(userId);
  if (!user || !canUseSystem(user)) {
    res.status(403).send({ message: "Forbidden" });
    return;
  }

  (req as any).user = payload;
  next();
};
