import express from "express";
import cors from "cors";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicRouter } from "../router/public-router";
import { adminRouter } from "../router/admin-router";
import path from "node:path";

export const web = express();


web.use(express.json());

web.use(
  "/api/organizations/images",
  express.static(path.join(__dirname, "..", "..", "images"))
);

web.use("/api/organizations", publicRouter);
web.use("/api/organizations/admin", adminRouter);

web.use(errorMiddleware);
