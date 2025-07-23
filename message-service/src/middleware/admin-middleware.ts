import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";

export const adminMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user!.role !== "ADMIN") {
    return res.status(403).json({ error: "Forbidden" }).end();
  }
  next();
};
